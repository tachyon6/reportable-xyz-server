import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { FileService } from "./file.service";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";

@ApiTags("File")
@Controller("file")
export class FileController {
    constructor(private readonly fileService: FileService) {}

    @Post("upload")
    @UseInterceptors(FileInterceptor("file"))
    @ApiOperation({ summary: "파일 업로드", description: "파일을 S3에 업로드하고 URL을 반환합니다." })
    @ApiConsumes("multipart/form-data")
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                file: {
                    type: "string",
                    format: "binary",
                    description: "업로드할 파일",
                },
            },
            required: ["file"],
        },
    })
    @ApiResponse({
        status: 201,
        description: "파일 업로드 성공",
        schema: {
            type: "object",
            properties: {
                url: {
                    type: "string",
                    description: "업로드된 파일의 S3 URL",
                    example: "https://reportable.s3.ap-northeast-2.amazonaws.com/documents/1234567890-example.docx",
                },
            },
        },
    })
    @ApiResponse({ status: 401, description: "인증되지 않은 요청" })
    async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<{ url: string }> {
        return this.fileService.uploadFile(file);
    }
}
