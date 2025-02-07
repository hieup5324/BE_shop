import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { createProductDto } from './productDTO/createProduct.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { updateProductDto } from './productDTO/updateProduct.dto';
import { LoggingInterceptor } from 'src/interceptor/logging.interceptor';
import { currentUser } from '../shared/decorators/currentUser.decorator';
import { UserEntity } from '../users/userEntity/user.entity';
import { RoleGuard } from 'src/guards/role.guard';
import { ProductEntity } from './entity/product.entity';
import { query } from 'express';
import { ProductsDto } from './productDTO/productDto';
import { SerializeIncludes } from 'src/interceptor/serializa.interceptor';

@Controller('product')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(new LoggingInterceptor())
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('/create')
  @UseGuards(new RoleGuard(['ADMIN']))
  @UseGuards(AuthGuard)
  createProduct(
    @Body() requestBody: createProductDto,
    @currentUser() currentUser: UserEntity,
  ): Promise<ProductEntity> {
    return this.productService.create(requestBody, currentUser);
  }

  @SerializeIncludes(ProductsDto)
  @Get()
  async findProductAll(@Query() query: any): Promise<ProductsDto> {
    return await this.productService.getAll(query);
  }

  @Get('/:id')
  getProductById(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findById(id);
  }

  @Put('/update/:id')
  @UseGuards(new RoleGuard(['ADMIN']))
  @UseGuards(AuthGuard)
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() requestBody: updateProductDto,
    @currentUser() currentUser: UserEntity,
  ) {
    return this.productService.updateById(id, requestBody, currentUser);
  }

  @Delete('/delete/:id')
  @UseGuards(new RoleGuard(['ADMIN']))
  @UseGuards(AuthGuard)
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return await this.productService.deleteProduct(id);
  }
}
