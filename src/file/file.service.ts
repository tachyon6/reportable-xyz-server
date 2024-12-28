import { Injectable } from "@nestjs/common";
import { S3 } from "aws-sdk";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class FileService {
    private s3: S3;

    constructor(private configService: ConfigService) {
        this.s3 = new S3({
            accessKeyId: this.configService.get("AWS_ACCESS_KEY_ID"),
            secretAccessKey: this.configService.get("AWS_SECRET_ACCESS_KEY"),
            region: this.configService.get("AWS_REGION"),
        });
    }

    async uploadFile(file: Express.Multer.File) {
        const { originalname, buffer, mimetype } = file;
        const key = `${Date.now()}-${originalname}`;

        const uploadResult = await this.s3
            .upload({
                Bucket: this.configService.get("AWS_BUCKET_NAME"),
                Key: key,
                Body: buffer,
                ContentType: mimetype,
            })
            .promise();

        return {
            url: uploadResult.Location,
        };
    }
}
