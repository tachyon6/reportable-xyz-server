import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService) {
        const secretKey = configService.get<string>("JWT_SECRET");
        if (!secretKey) {
            throw new Error("JWT_SECRET is not defined in environment variables");
        }

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: secretKey,
        });
    }

    async validate(payload: any) {
        return {
            id: payload.sub,
            email: payload.email,
            name: payload.name,
            profileImage: payload.profileImage,
        };
    }
}
