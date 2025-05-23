import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { BaseQuery } from 'src/common/base/dto/base.query';

export class ProductQuery extends BaseQuery {
  @ApiPropertyOptional()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  price?: string;

  @ApiPropertyOptional()
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  is_stock?: string;
}
