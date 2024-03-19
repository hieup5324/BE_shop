import { Process, Processor } from '@nestjs/bull';
import { MailerService } from '@nestjs-modules/mailer';
import { Job } from 'bull';

@Processor('send-email')
export class EmailConsumer {
  constructor(private mailerService: MailerService) {}

  @Process('register')
  async sendEmail(job: Job<unknown>) {
    console.log(job.data);
    await this.mailerService.sendMail({
      to: 'hieup5324@gmail.com',
      subject: 'Welcome to my shop',
      html: ` <p>Hi ${job.data['name']}, We understand that finding the perfect computer is more than just a purchase; it's an investment in your productivity, creativity, and enjoyment. That's why we're committed to offering a wide range of high-quality computers, accessories, and exceptional service to meet your needs.</p>
      <p>If you need additional assistance, or you received this email in error, please contact us at <a href="mminhvcvc1@gmail.com">mminhvcvc1@gmail.com</a></p>`,
      context: {
        name: job.data['firstName'],
      },
    });
    console.log('send email');
  }
}
