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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { createProductDto } from './productDTO/createProduct.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { updateProductDto } from './productDTO/updateProduct.dto';
import { LoggingInterceptor } from 'src/interceptor/logging.interceptor';
import { currentUser } from '../users/decorators/currentUser.decorator';
import { UserEntity } from '../users/userEntity/user.entity';

@Controller('product')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(new LoggingInterceptor())
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post('/create')
  @UseGuards(AuthGuard)
  createProduct(
    @Body() requestBody: createProductDto,
    @currentUser() currentUser: UserEntity,
  ) {
    return this.productService.create(requestBody, currentUser);
  }

  @Get()
  getAllProduct() {
    return this.productService.getAll();
  }

  @Get('/:id')
  getProductById(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findById(id);
  }

  @Put('/update/:id')
  @UseGuards(AuthGuard)
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() requestBody: updateProductDto,
    @currentUser() currentUser: UserEntity,
  ) {
    return this.productService.updateById(id, requestBody, currentUser);
  }

  @Delete('/delete/:id')
  deleteProduct(
    @Param('id', ParseIntPipe) id: number,
    @currentUser() currentUser: UserEntity,
  ) {
    return this.productService.deleteProduct(id, currentUser);
  }
}
