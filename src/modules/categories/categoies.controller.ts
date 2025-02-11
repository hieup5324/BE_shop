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
import { AuthGuard } from 'src/guards/auth.guard';
import { LoggingInterceptor } from 'src/interceptor/logging.interceptor';
import { currentUser } from '../shared/decorators/currentUser.decorator';
import { UserEntity } from '../users/userEntity/user.entity';
import { createCategoryDto } from './categoriesDTO/create-category.dto';
import { updateCategoryDto } from './categoriesDTO/update-category.dto';
import { CategoryService } from './categoies.service';
import { RoleGuard } from 'src/guards/role.guard';
import { CategoryQuery } from './categoriesDTO/categories.query';

@Controller('categories')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(new LoggingInterceptor())
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  getAllCategory() {
    return this.categoryService.getAll();
  }

  @Get('/product')
  async getCategoryWithProduct(@Query() query: CategoryQuery) {
    return this.categoryService.getCategoryWithProduct(query);
  }

  @Post()
  @UseGuards(AuthGuard, new RoleGuard(['ADMIN']))
  createCategory(
    @Body() requestBody: createCategoryDto,
    @currentUser() currentUser: UserEntity,
  ) {
    return this.categoryService.create(requestBody, currentUser);
  }

  @Get('/:id')
  @UseGuards(new RoleGuard(['ADMIN']))
  getCategoryById(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.findById(id);
  }

  @Put('/update/:id')
  @UseGuards(AuthGuard)
  @UseGuards(new RoleGuard(['ADMIN']))
  updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() requestBody: updateCategoryDto,
    @currentUser() currentUser: UserEntity,
  ) {
    return this.categoryService.updateById(id, requestBody, currentUser);
  }

  @Delete('/delete/:id')
  @UseGuards(new RoleGuard(['ADMIN']))
  deleteCategory(
    @Param('id', ParseIntPipe) id: number,
    @currentUser() currentUser: UserEntity,
  ) {
    return this.categoryService.deleteCategory(id, currentUser);
  }
}
