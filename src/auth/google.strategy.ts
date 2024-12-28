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
        console.log("callbackURL", callbackURL);
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
            this.logger.log(`[Google Strategy] Validating profile for: ${profile.emails[0].value}`);

            const { name, emails, photos } = profile;
            const user = {
                email: emails[0].value,
                firstName: name.givenName,
                lastName: name.familyName,
                picture: photos[0].value,
                accessToken,
            };

            this.logger.log(`[Google Strategy] Successfully validated profile for: ${user.email}`);
            done(null, user);
        } catch (error) {
            this.logger.error(`[Google Strategy Error] ${error.message}`, error.stack);
            done(error, null);
        }
    }
}
