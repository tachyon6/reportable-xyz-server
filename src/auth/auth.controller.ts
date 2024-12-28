import { Controller, Get, UseGuards, Req, Res } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { Response } from "express";

@ApiTags("인증")
@Controller("auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService
    ) {}

    @Get("google")
    @UseGuards(AuthGuard("google"))
    @ApiOperation({ summary: "Google OAuth 로그인 시작" })
    async googleAuth() {
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
        const user = await this.authService.validateUser(req.user.email, req.user.name, req.user.profileImage);
        const { access_token } = await this.authService.login(user);
        const clientUrl = this.configService.get<string>("CLIENT_URL");

        // 클라이언트로 리다이렉트하면서 인증 코드를 쿼리 파라미터로 전달
        res.redirect(`${clientUrl}/login?code=${access_token}`);
    }
}
