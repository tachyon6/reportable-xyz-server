"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const template_entity_1 = require("../../entities/template.entity");
const openai_1 = require("openai");
const config_1 = require("@nestjs/config");
let TemplateService = class TemplateService {
    constructor(templateRepository, configService) {
        this.templateRepository = templateRepository;
        this.configService = configService;
        this.openai = new openai_1.default({
            apiKey: this.configService.get("OPENAI_API_KEY"),
        });
    }
    async createTemplate(dto) {
        const template = this.templateRepository.create({
            name: dto.name,
            content: dto.content,
        });
        return this.templateRepository.save(template);
    }
    async getEmbedding(text) {
        const response = await this.openai.embeddings.create({
            model: "text-embedding-3-small",
            input: text,
        });
        return response.data[0].embedding;
    }
    calculateCosineSimilarity(a, b) {
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
    async findMatchingTemplate(prompt) {
        const templates = await this.templateRepository.find();
        if (templates.length === 0)
            return null;
        const promptEmbedding = await this.getEmbedding(prompt);
        const similarities = await Promise.all(templates.map(async (template) => {
            const templateEmbedding = await this.getEmbedding(template.name);
            return {
                template,
                similarity: this.calculateCosineSimilarity(promptEmbedding, templateEmbedding),
            };
        }));
        const bestMatch = similarities.reduce((best, current) => current.similarity > best.similarity ? current : best);
        return bestMatch.similarity > 0.7 ? bestMatch.template : null;
    }
};
exports.TemplateService = TemplateService;
exports.TemplateService = TemplateService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(template_entity_1.Template)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService])
], TemplateService);
//# sourceMappingURL=template.service.js.map