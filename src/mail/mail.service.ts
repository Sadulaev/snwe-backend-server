import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { userConfirm } from './user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: userConfirm, link: string) {
    const url = `${process.env.API_URL}/users/mail/confirm/${link}`;
    console.log(user.email);
    try {
      await this.mailerService.sendMail({
        from: process.env.SMTP_USER,
        to: user.email,
        subject: 'Welcome to Super Nutrition! Confirm your Email',
        template: './confirmation',
        context: {
          name: user.name,
          url,
        },
      });
    } catch (e) {
      console.log(e);
    }
  }
}
