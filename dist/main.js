"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const logger = new common_1.Logger("App");
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
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
        ],
        credentials: true,
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle("Reportable API")
        .setDescription("The Reportable API description")
        .setVersion("1.0")
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup("api", app, document);
    await app.listen(8000);
    logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
//# sourceMappingURL=main.js.map