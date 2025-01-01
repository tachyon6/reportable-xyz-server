import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { typeOrmConfigAsync } from "./config/typeorm.config";
import { AuthModule } from "./auth/auth.module";
import { ChatModule } from "./chat/chat.module";
import { FileModule } from "./file/file.module";
import { EmailModule } from "./email/email.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync(typeOrmConfigAsync),
        AuthModule,
        ChatModule,
        FileModule,
        EmailModule,
    ],
})
export class AppModule {}
