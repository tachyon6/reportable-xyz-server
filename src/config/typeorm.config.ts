import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { ChatRoom } from "../entities/chat-room.entity";
import { Chat } from "../entities/chat.entity";
import { Template } from "../entities/template.entity";
import { ConfigService } from "@nestjs/config";

export const typeOrmConfigAsync = {
    useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => ({
        type: "mysql",
        host: configService.get("DB_HOST"),
        port: configService.get("DB_PORT"),
        username: configService.get("DB_USERNAME"),
        password: configService.get("DB_PASSWORD"),
        database: configService.get("DB_DATABASE"),
        entities: [User, ChatRoom, Chat, Template],
        synchronize: true,
        connectTimeout: 60000,
        retryAttempts: 5,
        retryDelay: 3000,
        extra: {
            connectionLimit: 10,
        },
    }),
    inject: [ConfigService],
};
