import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class StatisticQuery {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  year?: string;
}
