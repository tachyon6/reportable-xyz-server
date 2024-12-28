import { IsString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateTemplateDto {
    @ApiProperty({
        description: "템플릿 이름",
        example: "회의록 템플릿",
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: "템플릿 내용 (HTML 형식)",
        example: "<div class='meeting-minutes'><h1>{title}</h1><div class='content'>{content}</div></div>",
    })
    @IsString()
    @IsNotEmpty()
    content: string;
}
