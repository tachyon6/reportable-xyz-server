import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Template } from "../../entities/template.entity";
import { CreateTemplateDto } from "../dto/create-template.dto";
import OpenAI from "openai";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class TemplateService {
    private openai: OpenAI;

    constructor(
        @InjectRepository(Template)
        private templateRepository: Repository<Template>,
        private configService: ConfigService
    ) {
        this.openai = new OpenAI({
            apiKey: this.configService.get<string>("OPENAI_API_KEY"),
        });
    }

    async createTemplate(dto: CreateTemplateDto): Promise<Template> {
        const template = this.templateRepository.create({
            name: dto.name,
            content: dto.content,
        });

        return this.templateRepository.save(template);
    }

    private async getEmbedding(text: string): Promise<number[]> {
        const response = await this.openai.embeddings.create({
            model: "text-embedding-3-small",
            input: text,
        });
        return response.data[0].embedding;
    }

    private calculateCosineSimilarity(a: number[], b: number[]): number {
        let dotProduct = 0;
        let normA = 0;
        let normB = 0;

        for (let i = 0; i < a.length; i++) {
            dotProduct += a[i] * b[i];
            normA += a[i] * a[i];
            normB += b[i] * b[i];
        }

        normA = Math.sqrt(normA);
        normB = Math.sqrt(normB);

        return dotProduct / (normA * normB);
    }

    async findMatchingTemplate(prompt: string): Promise<Template | null> {
        const templates = await this.templateRepository.find();
        if (templates.length === 0) return null;

        // 프롬프트의 임베딩 생성
        const promptEmbedding = await this.getEmbedding(prompt);

        // 각 템플릿의 유사도 계산
        const similarities = await Promise.all(
            templates.map(async (template) => {
                const templateEmbedding = await this.getEmbedding(template.name);
                return {
                    template,
                    similarity: this.calculateCosineSimilarity(promptEmbedding, templateEmbedding),
                };
            })
        );

        // 가장 높은 유사도를 가진 템플릿 찾기
        const bestMatch = similarities.reduce((best, current) =>
            current.similarity > best.similarity ? current : best
        );

        // 유사도가 일정 임계값(0.7)을 넘는 경우에만 템플릿 반환
        return bestMatch.similarity > 0.7 ? bestMatch.template : null;
    }
}