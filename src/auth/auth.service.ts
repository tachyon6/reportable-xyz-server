import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
        private configService: ConfigService
    ) {}

    async validateUser(email: string, name: string, profileImage: string): Promise<User> {
        let user = await this.userRepository.findOne({ where: { email } });

        if (!user) {
            user = this.userRepository.create({
                email,
                name,
                profileImage,
            });
            await this.userRepository.save(user);
        }

        return user;
    }

    async login(user: User) {
        const payload = {
            email: user.email,
            sub: user.id,
            name: user.name,
            profileImage: user.profileImage,
        };

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                profileImage: user.profileImage,
            },
        };
    }

    async validateToken(token: string): Promise<any> {
        try {
            return this.jwtService.verify(token);
        } catch (e) {
            return null;
        }
    }
}
