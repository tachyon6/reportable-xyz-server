import { IsString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateChatDto {
    @ApiProperty({
        description: "채팅 메시지 내용",
        example: "안녕하세요, 회의를 시작하겠습니다.",
    })
    @IsString()
    @IsNotEmpty()
    content: string;
}
