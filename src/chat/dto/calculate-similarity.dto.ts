import { ApiProperty } from "@nestjs/swagger";

export class CalculateSimilarityDto {
    @ApiProperty({
        description: "유사도를 계산할 프롬프트 텍스트",
        example: "이력서를 작성해주세요",
    })
    prompt: string;
}
