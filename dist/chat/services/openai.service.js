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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIService = void 0;
const openai_1 = require("openai");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const zod_1 = require("openai/helpers/zod");
const zod_2 = require("zod");
const DocumentResponse = zod_2.z.object({
    title: zod_2.z.string(),
    response: zod_2.z.string(),
    result: zod_2.z.string(),
});
const ModifyResponse = zod_2.z.object({
    response: zod_2.z.string(),
    result: zod_2.z.string(),
});
let OpenAIService = class OpenAIService {
    constructor(configService) {
        this.configService = configService;
        this.openai = new openai_1.default({
            apiKey: this.configService.get("OPENAI_API_KEY"),
        });
    }
    async generateDocument(prompt, template) {
        const basePrompt = `사용자의 요청에 맞는 문서를 생성해주세요.

다음과 같은 JSON 형식으로 응답해주세요 (마크다운 코드 블록이나 다른 포맷 없이 순수 JSON만):
{
    "title": "생성된 문서의 제목 (간단하고 명확하게)",
    "response": "사용자의 요청에 대해 어떤 문서가 생성되었는지 구성 내용을 포함하여 상세히 설명하는 응답 메시지",
    "result": "생성된 HTML 문서 (불필요한 줄바꿈이나 들여쓰기 없이 한 줄로 작성해주세요. 브라우저에서 docx로 변환될 예정입니다. 표 같은 경우는 들어갈 경우 깔끔한 스타일로 작성해주세요.)"
}`;
        const fullPrompt = template
            ? `${basePrompt}\n\n다음 템플릿을 기반으로 문서를 생성해주세요:\n${template}\n\n요청: ${prompt}`
            : `${basePrompt}\n\n요청: ${prompt}`;
        const completion = await this.openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: fullPrompt }],
        });
        const content = completion.choices[0].message.content;
        console.log("OpenAI Response:", content);
        try {
            const cleanedContent = content
                .replace(/^```json\s*/, "")
                .replace(/```\s*$/, "")
                .trim();
            const parsedContent = JSON.parse(cleanedContent || "{}");
            parsedContent.result = parsedContent.result
                .replace(/\s+/g, " ")
                .replace(/>\s+</g, "><")
                .trim();
            return parsedContent;
        }
        catch (error) {
            console.error("Parse Error:", error);
            console.error("Failed Content:", content);
            throw new Error("Failed to parse OpenAI response as JSON");
        }
    }
    async modifyDocument(currentDocument, userInput) {
        const completion = await this.openai.beta.chat.completions.parse({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `현재 문서를 사용자의 요청에 따라 수정해주세요.
응답은 다음 두 가지를 포함해야 합니다:
1. response: 사용자의 요청에 대해 문서가 결과적으로 어떻게 수정되었는지 간략하게 설명하는 응답 메시지
2. result: 수정된 전체 HTML 문서`,
                },
                {
                    role: "user",
                    content: `현재 문서:\n${currentDocument}\n\n수정 요청:\n${userInput}`,
                },
            ],
            response_format: (0, zod_1.zodResponseFormat)(ModifyResponse, "modification"),
        });
        return completion.choices[0].message.parsed;
    }
};
exports.OpenAIService = OpenAIService;
exports.OpenAIService = OpenAIService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], OpenAIService);
//# sourceMappingURL=openai.service.js.map