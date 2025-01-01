import { Controller, Post, Body } from "@nestjs/common";
import { EmailService } from "./email.service";

class SendEmailDto {
    to: string;
    subject: string;
    text: string;
    html?: string;
}

@Controller("email")
export class EmailController {
    constructor(private readonly emailService: EmailService) {}

    @Post("send")
    async sendEmail(@Body() sendEmailDto: SendEmailDto) {
        return await this.emailService.sendEmail(
            sendEmailDto.to,
            sendEmailDto.subject,
            sendEmailDto.text,
            sendEmailDto.html
        );
    }
}
