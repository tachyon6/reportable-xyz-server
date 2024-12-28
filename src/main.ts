import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: false });
    app.useGlobalPipes(new ValidationPipe());

    app.enableCors({
        origin: "http://localhost:5173",
        credentials: true,
    });

    // Swagger 설정
    const config = new DocumentBuilder()
        .setTitle("Reportable API")
        .setDescription("Reportable 서비스의 API 문서")
        .setVersion("1.0")
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api-docs", app, document);

    await app.listen(3000);
}
bootstrap();
