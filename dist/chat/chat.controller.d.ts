import { ChatService } from "./services/chat.service";
import { TemplateService } from "./services/template.service";
import { CreateChatRoomDto } from "./dto/create-chat-room.dto";
import { CreateChatDto } from "./dto/create-chat.dto";
import { CreateTemplateDto } from "./dto/create-template.dto";
export declare class ChatController {
    private chatService;
    private templateService;
    constructor(chatService: ChatService, templateService: TemplateService);
    createTemplate(dto: CreateTemplateDto): Promise<import("../entities/template.entity").Template>;
    createChatRoom(req: any, dto: CreateChatRoomDto): Promise<import("../entities/chat-room.entity").ChatRoom>;
    addChat(roomId: number, dto: CreateChatDto): Promise<import("../entities/chat.entity").Chat>;
    revertChat(chatId: number): Promise<import("../entities/chat-room.entity").ChatRoom>;
    getChatRooms(req: any): Promise<import("../entities/chat-room.entity").ChatRoom[]>;
    getChatRoom(roomId: number, req: any): Promise<{
        id: number;
        title: string;
        lastResult: string;
        chats: import("../entities/chat.entity").Chat[];
        createdAt: Date;
    }>;
}
