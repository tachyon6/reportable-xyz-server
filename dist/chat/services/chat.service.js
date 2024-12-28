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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const chat_room_entity_1 = require("../../entities/chat-room.entity");
const chat_entity_1 = require("../../entities/chat.entity");
const openai_service_1 = require("./openai.service");
const template_service_1 = require("./template.service");
const typeorm_3 = require("typeorm");
let ChatService = class ChatService {
    constructor(chatRoomRepository, chatRepository, openAIService, templateService) {
        this.chatRoomRepository = chatRoomRepository;
        this.chatRepository = chatRepository;
        this.openAIService = openAIService;
        this.templateService = templateService;
    }
    async createChatRoom(userId, dto) {
        const template = await this.templateService.findMatchingTemplate(dto.initialPrompt);
        const initialResponse = await this.openAIService.generateDocument(dto.initialPrompt, template?.content);
        const chatRoom = this.chatRoomRepository.create({
            title: initialResponse.title,
            lastResult: initialResponse.result,
            user: { id: userId },
        });
        await this.chatRoomRepository.save(chatRoom);
        const chat = this.chatRepository.create({
            userInput: dto.initialPrompt,
            response: initialResponse.response,
            result: initialResponse.result,
            chatRoom,
        });
        await this.chatRepository.save(chat);
        return chatRoom;
    }
    async addChat(chatRoomId, dto) {
        const chatRoom = await this.chatRoomRepository.findOne({
            where: { id: chatRoomId },
        });
        if (!chatRoom) {
            throw new common_1.NotFoundException("Chat room not found");
        }
        const modifyResponse = await this.openAIService.modifyDocument(chatRoom.lastResult, dto.content);
        const chat = this.chatRepository.create({
            userInput: dto.content,
            response: modifyResponse.response,
            result: modifyResponse.result,
            chatRoom,
        });
        await this.chatRepository.save(chat);
        chatRoom.lastResult = modifyResponse.result;
        await this.chatRoomRepository.save(chatRoom);
        return chat;
    }
    async revertChat(chatId) {
        const chat = await this.chatRepository.findOne({
            where: { id: chatId },
            relations: ["chatRoom"],
        });
        if (!chat) {
            throw new common_1.NotFoundException("Chat not found");
        }
        const laterChats = await this.chatRepository.find({
            where: {
                chatRoom: { id: chat.chatRoom.id },
                id: (0, typeorm_3.Not)(chat.id),
                createdAt: (0, typeorm_3.MoreThanOrEqual)(chat.createdAt),
            },
            order: { createdAt: "ASC" },
        });
        for (const laterChat of laterChats) {
            laterChat.isReverted = true;
            await this.chatRepository.save(laterChat);
        }
        const chatRoom = chat.chatRoom;
        chatRoom.lastResult = chat.result;
        await this.chatRoomRepository.save(chatRoom);
        return chatRoom;
    }
    async getChatRooms(userId) {
        return this.chatRoomRepository.find({
            where: { user: { id: userId } },
            order: { createdAt: "DESC" },
            select: ["id", "title", "lastResult", "createdAt"],
        });
    }
    async getChatRoom(roomId, userId) {
        const chatRoom = await this.chatRoomRepository.findOne({
            where: { id: roomId },
            relations: ["user", "chats"],
            order: { chats: { createdAt: "ASC" } },
        });
        if (!chatRoom) {
            throw new common_1.NotFoundException("채팅방을 찾을 수 없습니다.");
        }
        if (chatRoom.user.id !== userId) {
            throw new common_1.UnauthorizedException("이 채팅방에 접근할 권한이 없습니다.");
        }
        const { user, ...result } = chatRoom;
        return result;
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(chat_room_entity_1.ChatRoom)),
    __param(1, (0, typeorm_1.InjectRepository)(chat_entity_1.Chat)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        openai_service_1.OpenAIService,
        template_service_1.TemplateService])
], ChatService);
//# sourceMappingURL=chat.service.js.map