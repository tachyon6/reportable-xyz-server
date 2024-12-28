import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ChatRoom } from "../../entities/chat-room.entity";
import { Chat } from "../../entities/chat.entity";
import { User } from "../../entities/user.entity";
import { OpenAIService } from "./openai.service";
import { TemplateService } from "./template.service";
import { CreateChatRoomDto } from "../dto/create-chat-room.dto";
import { CreateChatDto } from "../dto/create-chat.dto";
import { MoreThanOrEqual, MoreThan, Not } from "typeorm";

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(ChatRoom)
        private chatRoomRepository: Repository<ChatRoom>,
        @InjectRepository(Chat)
        private chatRepository: Repository<Chat>,
        private openAIService: OpenAIService,
        private templateService: TemplateService
    ) {}

    async createChatRoom(userId: number, dto: CreateChatRoomDto): Promise<ChatRoom> {
        const template = await this.templateService.findMatchingTemplate(dto.initialPrompt);
        const initialResponse = await this.openAIService.generateDocument(dto.initialPrompt, template?.content);

        const chatRoom = this.chatRoomRepository.create({
            title: initialResponse.title,
            lastResult: initialResponse.result,
            user: { id: userId },
        });

        await this.chatRoomRepository.save(chatRoom);

        // Save initial chat
        const chat = this.chatRepository.create({
            userInput: dto.initialPrompt,
            response: initialResponse.response,
            result: initialResponse.result,
            chatRoom,
        });

        await this.chatRepository.save(chat);

        return chatRoom;
    }

    async addChat(chatRoomId: number, dto: CreateChatDto): Promise<Chat> {
        const chatRoom = await this.chatRoomRepository.findOne({
            where: { id: chatRoomId },
        });

        if (!chatRoom) {
            throw new NotFoundException("Chat room not found");
        }

        const modifyResponse = await this.openAIService.modifyDocument(chatRoom.lastResult, dto.content);

        const chat = this.chatRepository.create({
            userInput: dto.content,
            response: modifyResponse.response,
            result: modifyResponse.result,
            chatRoom,
        });

        await this.chatRepository.save(chat);

        // Update lastResult in chatRoom
        chatRoom.lastResult = modifyResponse.result;
        await this.chatRoomRepository.save(chatRoom);

        return chat;
    }

    async revertChat(chatId: number): Promise<ChatRoom> {
        const chat = await this.chatRepository.findOne({
            where: { id: chatId },
            relations: ["chatRoom"],
        });

        if (!chat) {
            throw new NotFoundException("Chat not found");
        }

        // 선택한 채팅 이후의 모든 채팅을 가져옴 (선택한 채팅은 제외)
        const laterChats = await this.chatRepository.find({
            where: {
                chatRoom: { id: chat.chatRoom.id },
                id: Not(chat.id), // 선택한 채팅 제외
                createdAt: MoreThanOrEqual(chat.createdAt),
            },
            order: { createdAt: "ASC" },
        });

        // 이후 채팅들을 isReverted로 표시
        for (const laterChat of laterChats) {
            laterChat.isReverted = true;
            await this.chatRepository.save(laterChat);
        }

        // 채팅방의 lastResult를 선택한 채팅의 result로 업데이트
        const chatRoom = chat.chatRoom;
        chatRoom.lastResult = chat.result;
        await this.chatRoomRepository.save(chatRoom);

        return chatRoom;
    }

    async getChatRooms(userId: number) {
        return this.chatRoomRepository.find({
            where: { user: { id: userId } },
            order: { createdAt: "DESC" },
            select: ["id", "title", "lastResult", "createdAt"],
        });
    }

    async getChatRoom(roomId: number, userId: number) {
        const chatRoom = await this.chatRoomRepository.findOne({
            where: { id: roomId },
            relations: ["user", "chats"],
            order: { chats: { createdAt: "ASC" } },
        });

        if (!chatRoom) {
            throw new NotFoundException("채팅방을 찾을 수 없습니다.");
        }

        if (chatRoom.user.id !== userId) {
            throw new UnauthorizedException("이 채팅방에 접근할 권한이 없습니다.");
        }

        // user 정보는 제외하고 반환
        const { user, ...result } = chatRoom;
        return result;
    }
}
