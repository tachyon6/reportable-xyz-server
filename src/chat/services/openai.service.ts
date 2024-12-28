import OpenAI from "openai";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

const DocumentResponse = z.object({
    title: z.string(),
    response: z.string(),
    result: z.string(),
});

const ModifyResponse = z.object({
    response: z.string(),
    result: z.string(),
});

type DocumentResponseType = z.infer<typeof DocumentResponse>;
type ModifyResponseType = z.infer<typeof ModifyResponse>;

@Injectable()
export class OpenAIService {
    private openai: OpenAI;

    constructor(private configService: ConfigService) {
        this.openai = new OpenAI({
            apiKey: this.configService.get<string>("OPENAI_API_KEY"),
        });
    }

    async generateDocument(prompt: string, template?: string): Promise<DocumentResponseType> {
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

            // HTML에서 불필요한 줄바꿈과 연속된 공백 제거
            parsedContent.result = parsedContent.result
                .replace(/\s+/g, " ") // 연속된 공백문자를 하나로
                .replace(/>\s+</g, "><") // 태그 사이의 불필요한 공백 제거
                .trim();

            return parsedContent;
        } catch (error) {
            console.error("Parse Error:", error);
            console.error("Failed Content:", content);
            throw new Error("Failed to parse OpenAI response as JSON");
        }
    }

    async modifyDocument(currentDocument: string, userInput: string): Promise<ModifyResponseType> {
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
            response_format: zodResponseFormat(ModifyResponse, "modification"),
        });

        return completion.choices[0].message.parsed;
    }
}
