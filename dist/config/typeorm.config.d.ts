import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
export declare const typeOrmConfigAsync: {
    useFactory: (configService: ConfigService) => Promise<TypeOrmModuleOptions>;
    inject: (typeof ConfigService)[];
};
