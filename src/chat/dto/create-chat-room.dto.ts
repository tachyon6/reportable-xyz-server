import { IsString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateChatRoomDto {
    @ApiProperty({
        description: "채기 프롬프트",
        example: "회의록을 작성해주세요",
    })
    @IsString()
    @IsNotEmpty()
    initialPrompt: string;
}
