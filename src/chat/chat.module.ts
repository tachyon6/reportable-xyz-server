import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatController } from "./chat.controller";
import { ChatService } from "./services/chat.service";
import { OpenAIService } from "./services/openai.service";
import { TemplateService } from "./services/template.service";
import { ChatRoom } from "../entities/chat-room.entity";
import { Chat } from "../entities/chat.entity";
import { Template } from "../entities/template.entity";

@Module({
    imports: [TypeOrmModule.forFeature([ChatRoom, Chat, Template])],
    controllers: [ChatController],
    providers: [ChatService, OpenAIService, TemplateService],
})
export class ChatModule {}
