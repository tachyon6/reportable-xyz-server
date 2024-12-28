"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AuthController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const auth_service_1 = require("./auth.service");
const swagger_1 = require("@nestjs/swagger");
const config_1 = require("@nestjs/config");
let AuthController = AuthController_1 = class AuthController {
    constructor(authService, configService) {
        this.authService = authService;
        this.configService = configService;
        this.logger = new common_1.Logger(AuthController_1.name);
    }
    async googleAuth(req) {
        this.logger.log(`[Google Auth Start] Request from IP: ${req.ip}`);
    }
    async googleAuthRedirect(req, res) {
        try {
            this.logger.log(`[Google Auth Callback] Received callback for user: ${req.user?.email}`);
            const user = await this.authService.validateUser(req.user.email, req.user.name, req.user.profileImage);
            this.logger.log(`[Google Auth] User validated: ${user.email}`);
            const { access_token } = await this.authService.login(user);
            this.logger.log(`[Google Auth] Login successful for user: ${user.email}`);
            const clientUrl = this.configService.get("CLIENT_URL");
            const redirectUrl = `${clientUrl}/login?code=${access_token}`;
            this.logger.log(`[Google Auth] Redirecting to: ${clientUrl}/login`);
            res.redirect(redirectUrl);
        }
        catch (error) {
            this.logger.error(`[Google Auth Error] ${error.message}`, error.stack);
            const clientUrl = this.configService.get("CLIENT_URL");
            res.redirect(`${clientUrl}/login?error=auth_failed`);
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Get)("google"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("google")),
    (0, swagger_1.ApiOperation)({ summary: "Google OAuth 로그인 시작" }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuth", null);
__decorate([
    (0, common_1.Get)("google/callback"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("google")),
    (0, swagger_1.ApiOperation)({ summary: "Google OAuth 콜백 처리" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "로그인 성공",
        schema: {
            example: {
                access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                user: {
                    id: 1,
                    email: "user@example.com",
                    name: "홍길동",
                    profileImage: "https://example.com/profile.jpg",
                },
            },
        },
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuthRedirect", null);
exports.AuthController = AuthController = AuthController_1 = __decorate([
    (0, swagger_1.ApiTags)("인증"),
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        config_1.ConfigService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map