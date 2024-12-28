import { Repository } from "typeorm";
import { Template } from "../../entities/template.entity";
import { CreateTemplateDto } from "../dto/create-template.dto";
import { ConfigService } from "@nestjs/config";
export declare class TemplateService {
    private templateRepository;
    private configService;
    private openai;
    constructor(templateRepository: Repository<Template>, configService: ConfigService);
    createTemplate(dto: CreateTemplateDto): Promise<Template>;
    private getEmbedding;
    private calculateCosineSimilarity;
    findMatchingTemplate(prompt: string): Promise<Template | null>;
}
