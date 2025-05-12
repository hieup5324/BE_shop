import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { BaseQuery } from 'src/common/base/dto/base.query';

export class OrderQuery extends BaseQuery {
  @ApiPropertyOptional()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  payment_status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  is_admin?: boolean;
}
