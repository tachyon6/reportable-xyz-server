import { Repository } from "typeorm";
import { ChatRoom } from "../../entities/chat-room.entity";
import { Chat } from "../../entities/chat.entity";
import { OpenAIService } from "./openai.service";
import { TemplateService } from "./template.service";
import { CreateChatRoomDto } from "../dto/create-chat-room.dto";
import { CreateChatDto } from "../dto/create-chat.dto";
export declare class ChatService {
    private chatRoomRepository;
    private chatRepository;
    private openAIService;
    private templateService;
    constructor(chatRoomRepository: Repository<ChatRoom>, chatRepository: Repository<Chat>, openAIService: OpenAIService, templateService: TemplateService);
    createChatRoom(userId: number, dto: CreateChatRoomDto): Promise<ChatRoom>;
    addChat(chatRoomId: number, dto: CreateChatDto): Promise<Chat>;
    revertChat(chatId: number): Promise<ChatRoom>;
    getChatRooms(userId: number): Promise<ChatRoom[]>;
    getChatRoom(roomId: number, userId: number): Promise<{
        id: number;
        title: string;
        lastResult: string;
        chats: Chat[];
        createdAt: Date;
    }>;
}
