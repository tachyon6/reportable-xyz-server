import { ConfigService } from "@nestjs/config";
export declare class FileService {
    private configService;
    private s3;
    constructor(configService: ConfigService);
    uploadFile(file: Express.Multer.File): Promise<{
        url: string;
    }>;
}
