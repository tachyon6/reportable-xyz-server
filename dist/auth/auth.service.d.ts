import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
export declare class AuthService {
    private userRepository;
    private jwtService;
    private configService;
    constructor(userRepository: Repository<User>, jwtService: JwtService, configService: ConfigService);
    validateUser(email: string, name: string, profileImage: string): Promise<User>;
    login(user: User): Promise<{
        access_token: string;
        user: {
            id: number;
            email: string;
            name: string;
            profileImage: string;
        };
    }>;
    validateToken(token: string): Promise<any>;
}
