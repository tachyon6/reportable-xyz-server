import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: ["http://localhost:5173", "http://localhost:3000", "https://reportable.xyz"],
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
}
bootstrap();
