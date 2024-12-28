import { Controller, Get, UseGuards, Req, Res, Logger } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { Response } from "express";

@ApiTags("인증")
@Controller("auth")
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService
    ) {}

    @Get("google")
    @UseGuards(AuthGuard("google"))
    @ApiOperation({ summary: "Google OAuth 로그인 시작" })
    async googleAuth(@Req() req) {
        this.logger.log(`[Google Auth Start] Request from IP: ${req.ip}`);
        // Google OAuth 페이지로 리다이렉트
    }

    @Get("google/callback")
    @UseGuards(AuthGuard("google"))
    @ApiOperation({ summary: "Google OAuth 콜백 처리" })
    @ApiResponse({
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
    })
    async googleAuthRedirect(@Req() req, @Res() res: Response) {
        try {
            this.logger.log(`[Google Auth Callback] Received callback for user: ${req.user?.email}`);

            const user = await this.authService.validateUser(req.user.email, req.user.name, req.user.profileImage);
            this.logger.log(`[Google Auth] User validated: ${user.email}`);

            const { access_token } = await this.authService.login(user);
            this.logger.log(`[Google Auth] Login successful for user: ${user.email}`);

            const clientUrl = this.configService.get<string>("CLIENT_URL");
            const redirectUrl = `${clientUrl}/login?code=${access_token}`;
            this.logger.log(`[Google Auth] Redirecting to: ${clientUrl}/login`);

            res.redirect(redirectUrl);
        } catch (error) {
            this.logger.error(`[Google Auth Error] ${error.message}`, error.stack);
            const clientUrl = this.configService.get<string>("CLIENT_URL");
            res.redirect(`${clientUrl}/login?error=auth_failed`);
        }
    }
}
