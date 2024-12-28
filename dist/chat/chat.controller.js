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
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const chat_service_1 = require("./services/chat.service");
const template_service_1 = require("./services/template.service");
const create_chat_room_dto_1 = require("./dto/create-chat-room.dto");
const create_chat_dto_1 = require("./dto/create-chat.dto");
const create_template_dto_1 = require("./dto/create-template.dto");
const swagger_1 = require("@nestjs/swagger");
let ChatController = class ChatController {
    constructor(chatService, templateService) {
        this.chatService = chatService;
        this.templateService = templateService;
    }
    async createTemplate(dto) {
        return this.templateService.createTemplate(dto);
    }
    async createChatRoom(req, dto) {
        return this.chatService.createChatRoom(req.user.id, dto);
    }
    async addChat(roomId, dto) {
        return this.chatService.addChat(roomId, dto);
    }
    async revertChat(chatId) {
        return this.chatService.revertChat(chatId);
    }
    async getChatRooms(req) {
        return this.chatService.getChatRooms(req.user.id);
    }
    async getChatRoom(roomId, req) {
        return this.chatService.getChatRoom(roomId, req.user.id);
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Post)("template"),
    (0, swagger_1.ApiOperation)({ summary: "새로운 템플릿 생성" }),
    (0, swagger_1.ApiResponse)({
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
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_template_dto_1.CreateTemplateDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "createTemplate", null);
__decorate([
    (0, common_1.Post)("room"),
    (0, swagger_1.ApiOperation)({ summary: "새로운 채팅방 생성" }),
    (0, swagger_1.ApiResponse)({
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
    }),
    (0, swagger_1.ApiBody)({
        type: create_chat_room_dto_1.CreateChatRoomDto,
        examples: {
            example1: {
                value: {
                    initialPrompt: "회의록을 작성해주세요",
                },
            },
        },
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_chat_room_dto_1.CreateChatRoomDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "createChatRoom", null);
__decorate([
    (0, common_1.Post)("room/:roomId"),
    (0, swagger_1.ApiOperation)({ summary: "채팅방에 새 메시지 추가" }),
    (0, swagger_1.ApiResponse)({
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
    }),
    (0, swagger_1.ApiBody)({
        type: create_chat_dto_1.CreateChatDto,
        examples: {
            example1: {
                value: {
                    content: "안녕하세요, 회의를 시작하겠습니다.",
                },
            },
        },
    }),
    __param(0, (0, common_1.Param)("roomId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_chat_dto_1.CreateChatDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "addChat", null);
__decorate([
    (0, common_1.Post)("revert/:chatId"),
    (0, swagger_1.ApiOperation)({ summary: "채팅 메시지 되돌리기" }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "채팅 메시지 되돌리기 성공",
        schema: {
            example: {
                success: true,
                message: "채팅이 성공적으로 되돌려졌습니다.",
                revertedChatId: 1,
            },
        },
    }),
    __param(0, (0, common_1.Param)("chatId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "revertChat", null);
__decorate([
    (0, common_1.Get)("rooms"),
    (0, swagger_1.ApiOperation)({ summary: "사용자의 모든 채팅방 목록 조회" }),
    (0, swagger_1.ApiResponse)({
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
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getChatRooms", null);
__decorate([
    (0, common_1.Get)("room/:roomId"),
    (0, swagger_1.ApiOperation)({ summary: "특정 채팅방 상세 정보 조회" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "채팅방 상세 정보 조회 성공",
        schema: {
            example: {
                id: 1,
                title: "프로젝트 회의록",
                lastResult: "마지막 생성된 문서 내용",
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
    }),
    __param(0, (0, common_1.Param)("roomId")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getChatRoom", null);
exports.ChatController = ChatController = __decorate([
    (0, swagger_1.ApiTags)("채팅"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)("chat"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt")),
    __metadata("design:paramtypes", [chat_service_1.ChatService,
        template_service_1.TemplateService])
], ChatController);
//# sourceMappingURL=chat.controller.js.map