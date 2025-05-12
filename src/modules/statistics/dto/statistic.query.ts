import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { BaseQuery } from 'src/common/base/dto/base.query';

export class StatisticQuery {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  year?: string;
}
