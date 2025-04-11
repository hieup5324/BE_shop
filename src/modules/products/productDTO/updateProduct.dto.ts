import { PartialType } from '@nestjs/mapped-types';
import { createProductDto } from './createProduct.dto';

export class updateProductDto extends PartialType(createProductDto) {}
