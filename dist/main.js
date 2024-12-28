"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { cors: false });
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.enableCors({
        origin: "http://localhost:5173",
        credentials: true,
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle("Reportable API")
        .setDescription("Reportable 서비스의 API 문서")
        .setVersion("1.0")
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup("api-docs", app, document);
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map