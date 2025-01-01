import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { Logger } from "@nestjs/common";

async function bootstrap() {
    const logger = new Logger("App");
    const app = await NestFactory.create(AppModule);

    // 모든 요청에 대한 로깅 미들웨어
    app.use((req, res, next) => {
        logger.log(`[${req.method}] ${req.url} - IP: ${req.ip}`);
        next();
    });

    app.enableCors({
        origin: [
            "http://localhost:5173",
            "http://localhost:3000",
            "https://reportable.xyz",
            "https://www.reportable.xyz",
            "https://heartsolo.com",
        ],
        credentials: true,
    });

    const config = new DocumentBuilder()
        .setTitle("Reportable API")
        .setDescription("The Reportable API description")
        .setVersion("1.0")
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api", app, document);

    await app.listen(8000);
    logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
