import { Injectable, Logger } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { AuthService } from "./auth.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
    private readonly logger = new Logger(GoogleStrategy.name);

    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService
    ) {
        const callbackURL = `${configService.get<string>("API_URL")}/auth/google/callback`;
        super({
            clientID: configService.get<string>("GOOGLE_CLIENT_ID"),
            clientSecret: configService.get<string>("GOOGLE_CLIENT_SECRET"),
            callbackURL,
            scope: ["email", "profile"],
        });

        this.logger.log(`Initialized Google Strategy with callback URL: ${callbackURL}`);
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
        try {
            const { name, emails, photos } = profile;
            const user = {
                email: emails[0].value,
                firstName: name.givenName,
                lastName: name.familyName,
                picture: photos[0].value,
                accessToken,
            };

            this.logger.log(`Successfully validated Google profile for email: ${emails[0].value}`);
            done(null, user);
        } catch (error) {
            this.logger.error(`Error validating Google profile: ${error.message}`);
            done(error, null);
        }
    }
}
