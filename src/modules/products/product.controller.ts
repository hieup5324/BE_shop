import {
  BadRequestException,
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
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Request,
  Patch,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { createProductDto } from './productDTO/createProduct.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { updateProductDto } from './productDTO/updateProduct.dto';
import { LoggingInterceptor } from 'src/interceptor/logging.interceptor';
import { currentUser } from '../shared/decorators/currentUser.decorator';
import { UserEntity } from '../users/userEntity/user.entity';
import { RoleGuard, Roles, TYPE_LOGIN } from 'src/guards/role.guard';
import { ProductEntity } from './entity/product.entity';
import { query } from 'express';
import { ProductsDto } from './productDTO/productDto';
import { SerializeIncludes } from 'src/interceptor/serializa.interceptor';
import { ProductQuery } from './productDTO/product.query';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../config/cloudinary.service';

@Controller('products')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(new LoggingInterceptor())
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get()
  async getProducts(@Query() query: ProductQuery): Promise<any> {
    return await this.productService.getProducts(query);
  }

  @Get('/:id')
  getProductById(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findById(id);
  }

  @Post()
  @Roles(TYPE_LOGIN.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @UseInterceptors(
    FileInterceptor('photo_url', {
      limits: {
        fieldNameSize: 255,
        fileSize: 50e6,
      },
    }),
  )
  async createProduct(
    @Body() requestBody: any,
    @UploadedFile() file: Express.Multer.File,
    @currentUser() currentUser: UserEntity,
  ): Promise<ProductEntity> {
    if (file) {
      try {
        const imageUrl = await this.cloudinaryService.uploadImage(file);
        requestBody.photo_url = imageUrl;
      } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        throw new BadRequestException('Failed to upload image to Cloudinary');
      }
    }
    return this.productService.create(requestBody, currentUser);
  }

  @Patch('/:id')
  @Roles(TYPE_LOGIN.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @UseInterceptors(
    FileInterceptor('photo_url', {
      limits: {
        fieldNameSize: 255,
        fileSize: 50e6,
      },
    }),
  )
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() requestBody: any,
    @UploadedFile() file: Express.Multer.File,
    @currentUser() currentUser: UserEntity,
  ): Promise<ProductEntity> {
    if (file) {
      try {
        const imageUrl = await this.cloudinaryService.uploadImage(file);
        requestBody.photo_url = imageUrl;
      } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        throw new BadRequestException('Failed to upload image to Cloudinary');
      }
    }
    return this.productService.updateById(id, requestBody, currentUser);
  }

  // @Delete('/delete/:id')
  // @UseGuards(new RoleGuard(['ADMIN']))
  // @UseGuards(AuthGuard)
  // async deleteProduct(@Param('id', ParseIntPipe) id: number) {
  //   return await this.productService.deleteProduct(id);
  // }
}
