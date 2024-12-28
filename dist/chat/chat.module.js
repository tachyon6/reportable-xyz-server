"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const chat_controller_1 = require("./chat.controller");
const chat_service_1 = require("./services/chat.service");
const openai_service_1 = require("./services/openai.service");
const template_service_1 = require("./services/template.service");
const chat_room_entity_1 = require("../entities/chat-room.entity");
const chat_entity_1 = require("../entities/chat.entity");
const template_entity_1 = require("../entities/template.entity");
let ChatModule = class ChatModule {
};
exports.ChatModule = ChatModule;
exports.ChatModule = ChatModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([chat_room_entity_1.ChatRoom, chat_entity_1.Chat, template_entity_1.Template])],
        controllers: [chat_controller_1.ChatController],
        providers: [chat_service_1.ChatService, openai_service_1.OpenAIService, template_service_1.TemplateService],
    })
], ChatModule);
//# sourceMappingURL=chat.module.js.map