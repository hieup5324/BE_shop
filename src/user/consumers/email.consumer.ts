import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Processor('email')
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(private readonly mailerService: MailerService) {}

  @Process('send')
  async sendEmail(job) {
    this.logger.debug('Start processing email job');
    const { to, subject, template, context } = job.data;
    await this.mailerService.sendMail({
      to,
      subject,
      template,
      context,
    });
    this.logger.debug(`Email sent to ${to}`);
  }
}
