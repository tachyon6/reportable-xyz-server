import { ConfigService } from "@nestjs/config";
import { z } from "zod";
declare const DocumentResponse: z.ZodObject<{
    title: z.ZodString;
    response: z.ZodString;
    result: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title?: string;
    response?: string;
    result?: string;
}, {
    title?: string;
    response?: string;
    result?: string;
}>;
declare const ModifyResponse: z.ZodObject<{
    response: z.ZodString;
    result: z.ZodString;
}, "strip", z.ZodTypeAny, {
    response?: string;
    result?: string;
}, {
    response?: string;
    result?: string;
}>;
type DocumentResponseType = z.infer<typeof DocumentResponse>;
type ModifyResponseType = z.infer<typeof ModifyResponse>;
export declare class OpenAIService {
    private configService;
    private openai;
    constructor(configService: ConfigService);
    generateDocument(prompt: string, template?: string): Promise<DocumentResponseType>;
    modifyDocument(currentDocument: string, userInput: string): Promise<ModifyResponseType>;
}
export {};
