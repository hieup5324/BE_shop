import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsDateString, IsNumber } from 'class-validator';

export class BaseQuery {
  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  from_date?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  to_date?: Date;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    example: 1,
  })
  page?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    example: 10,
  })
  page_size?: number;
}
