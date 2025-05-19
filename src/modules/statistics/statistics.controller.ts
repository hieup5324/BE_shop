import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { LoggingInterceptor } from 'src/interceptor/logging.interceptor';
import { StatisticService } from './statistics.service';
import { StatisticQuery } from './dto/statistic.query';

@Controller('statistics')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(new LoggingInterceptor())
export class StatisticController {
  constructor(private readonly service: StatisticService) {}

  @Get()
  async getOverView() {
    return await this.service.getOverView();
  }

  @Get('revenue')
  async getAllOderRevenen(@Query() query: StatisticQuery) {
    return await this.service.getAllOderRevenen(query);
  }
}
