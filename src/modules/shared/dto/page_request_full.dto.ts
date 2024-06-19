import { ApiProperty } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import {
  IsOptional,
  IsNumber,
  Min,
  IsArray,
  IsDateString,
  IsString,
} from 'class-validator';
import { IFilterDateRequest } from 'src/common/base/pagination/IFilterDateRequest';
import { IFilterFieldRequest } from 'src/common/base/pagination/IFilterFiedRequest';
import { IFilterOrdRequest } from 'src/common/base/pagination/IOrderRequest';
import { IPageRequest } from 'src/common/base/pagination/IPageRequest';
import { ISearchRequest } from 'src/common/base/pagination/ISearchRequest';
import { ISortRequest } from 'src/common/base/pagination/ISortRequest';

export class PageRequestFullDto
  implements
    IPageRequest,
    IFilterDateRequest,
    IFilterFieldRequest,
    IFilterOrdRequest,
    ISearchRequest,
    ISortRequest
{
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @ApiProperty({
    example: 1,
  })
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @ApiProperty({
    example: 10,
  })
  pageSize?: number;

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => (Array.isArray(value) ? value : Array(value)))
  sort?: string[];

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => (Array.isArray(value) ? value : Array(value)))
  search?: string[];

  @ApiProperty({
    description: 'ISO Time',
    // example: '2023-05-08T14:36:50.400Z',
  })
  @IsOptional()
  @IsDateString()
  dateFrom?: Date;

  @ApiProperty({
    description: 'ISO Time',
    // example: '2023-05-08T14:36:50.400Z',
  })
  @IsOptional()
  @IsDateString()
  dateTo?: Date;

  @ApiProperty({
    example: '',
  })
  @IsOptional()
  controlCode?: string;

  @ApiProperty({
    example: '',
  })
  @IsOptional()
  @IsString()
  orderCode?: string;

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => (Array.isArray(value) ? value : Array(value)))
  filter?: string[];

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => (Array.isArray(value) ? value : Array(value)))
  or?: string[];

  @IsOptional()
  @IsString()
  searchPhoneOrName?: string;
}
