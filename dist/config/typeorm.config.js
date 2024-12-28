"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmConfigAsync = void 0;
const user_entity_1 = require("../entities/user.entity");
const chat_room_entity_1 = require("../entities/chat-room.entity");
const chat_entity_1 = require("../entities/chat.entity");
const template_entity_1 = require("../entities/template.entity");
const config_1 = require("@nestjs/config");
exports.typeOrmConfigAsync = {
    useFactory: async (configService) => ({
        type: "mysql",
        host: configService.get("DB_HOST"),
        port: configService.get("DB_PORT"),
        username: configService.get("DB_USERNAME"),
        password: configService.get("DB_PASSWORD"),
        database: configService.get("DB_DATABASE"),
        entities: [user_entity_1.User, chat_room_entity_1.ChatRoom, chat_entity_1.Chat, template_entity_1.Template],
        synchronize: true,
        connectTimeout: 60000,
        retryAttempts: 5,
        retryDelay: 3000,
        extra: {
            connectionLimit: 10,
        },
    }),
    inject: [config_1.ConfigService],
};
//# sourceMappingURL=typeorm.config.js.map