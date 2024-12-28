import { Controller, Post, Body, Param, UseGuards, Req, Get, Logger } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ChatService } from "./services/chat.service";
import { TemplateService } from "./services/template.service";
import { CreateChatRoomDto } from "./dto/create-chat-room.dto";
import { CreateChatDto } from "./dto/create-chat.dto";
import { CreateTemplateDto } from "./dto/create-template.dto";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from "@nestjs/swagger";

@ApiTags("채팅")
@ApiBearerAuth()
@Controller("chat")
@UseGuards(AuthGuard("jwt"))
export class ChatController {
    private readonly logger = new Logger(ChatController.name);

    constructor(
        private chatService: ChatService,
        private templateService: TemplateService
    ) {}

    @Post("template")
    @ApiOperation({ summary: "새로운 템플릿 생성" })
    @ApiResponse({
        status: 201,
        description: "템플릿 생성 성공",
        schema: {
            example: {
                id: 1,
                name: "회의록 템플릿",
                content: "<div class='meeting-minutes'><h1>{title}</h1><div class='content'>{content}</div></div>",
                promptPattern: "회의록",
            },
        },
    })
    async createTemplate(@Body() dto: CreateTemplateDto) {
        return this.templateService.createTemplate(dto);
    }

    @Post("room")
    @ApiOperation({ summary: "새로운 채팅방 생성" })
    @ApiResponse({
        status: 201,
        description: "채팅방 생성 성공",
        schema: {
            example: {
                id: 1,
                title: "프로젝트 회의록",
                initialPrompt: "회의록을 작성해주세요",
                userId: 123,
                createdAt: "2024-03-15T12:00:00Z",
            },
        },
    })
    @ApiBody({
        type: CreateChatRoomDto,
        examples: {
            example1: {
                value: {
                    initialPrompt: "회의록을 작성해주세요",
                },
            },
        },
    })
    async createChatRoom(@Req() req, @Body() dto: CreateChatRoomDto) {
        return this.chatService.createChatRoom(req.user.id, dto);
    }

    @Post("room/:roomId")
    @ApiOperation({ summary: "채팅방에 새 메시지 추가" })
    @ApiResponse({
        status: 201,
        description: "채팅 메시지 추가 성공",
        schema: {
            example: {
                id: 1,
                content: "안녕하세요, 회의를 시작하겠습니다.",
                roomId: 1,
                createdAt: "2024-03-15T12:01:00Z",
            },
        },
    })
    @ApiBody({
        type: CreateChatDto,
        examples: {
            example1: {
                value: {
                    content: "안녕하세요, 회의를 시작하겠습니다.",
                },
            },
        },
    })
    async addChat(@Param("roomId") roomId: number, @Body() dto: CreateChatDto) {
        return this.chatService.addChat(roomId, dto);
    }

    @Post("revert/:chatId")
    @ApiOperation({ summary: "채팅 메시지 되돌리기" })
    @ApiResponse({
        status: 201,
        description: "채팅 메시지 되돌리기 성공",
        schema: {
            example: {
                success: true,
                message: "채팅이 성공적으로 되돌려졌습니다.",
                revertedChatId: 1,
            },
        },
    })
    async revertChat(@Param("chatId") chatId: number) {
        return this.chatService.revertChat(chatId);
    }

    @Get("rooms")
    @ApiOperation({ summary: "사용자의 모든 채팅방 목록 조회" })
    @ApiResponse({
        status: 200,
        description: "채팅방 목록 조회 성공",
        schema: {
            example: [
                {
                    id: 1,
                    title: "프로젝트 회의록",
                    lastResult: "마지막 생성된 문서 내용",
                    createdAt: "2024-03-15T12:00:00Z",
                },
            ],
        },
    })
    async getChatRooms(@Req() req) {
        return this.chatService.getChatRooms(req.user.id);
    }

    @Get("room/:roomId")
    @ApiOperation({ summary: "특정 채팅방 상세 정보 조회" })
    @ApiResponse({
        status: 200,
        description: "채팅방 상세 정보 조회 성공",
        schema: {
            example: {
                id: 1,
                title: "프로젝트 회의록",
                lastResult: "마��막 생성된 문서 내용",
                createdAt: "2024-03-15T12:00:00Z",
                chats: [
                    {
                        id: 1,
                        content: "안녕하세요, 회의를 시작하겠습니다.",
                        createdAt: "2024-03-15T12:01:00Z",
                    },
                ],
            },
        },
    })
    async getChatRoom(@Param("roomId") roomId: number, @Req() req) {
        return this.chatService.getChatRoom(roomId, req.user.id);
    }

    @Post("similarity")
    @ApiOperation({ summary: "프롬프트와 템플릿 간의 최대 유사도 계산" })
    @ApiResponse({
        status: 200,
        description: "유사도 계산 결과",
        schema: {
            example: {
                similarity: 0.85,
                template: {
                    id: 1,
                    name: "이력서 템플릿",
                    content: "템플릿 내용...",
                },
            },
        },
    })
    async calculateSimilarity(@Body() body: { prompt: string }) {
        this.logger.log(`[Similarity] Calculating similarity for prompt: ${body.prompt.substring(0, 50)}...`);
        const result = await this.templateService.calculateMaxSimilarity(body.prompt);
        return result;
    }
}
