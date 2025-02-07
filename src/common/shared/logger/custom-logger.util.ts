import { Logger } from '@nestjs/common';

export class CustomLogger {
  private readonly logger: Logger;
  private readonly context: string;

  constructor(context: string) {
    this.logger = new Logger(context);
    this.context = context;
  }

  log(data: string) {
    if (typeof data === 'string') {
      this.logger.log(data);
    } else {
      this.logger.log(data, this.context);
    }
  }

  warn(data: string) {
    if (typeof data === 'string') {
      this.logger.warn(data);
    } else {
      this.logger.warn(data, this.context);
    }
  }

  error(data: string) {
    if (typeof data === 'string') {
      this.logger.error(data, undefined, this.context);
    } else {
      this.logger.error(data, this.context);
    }
  }
}
