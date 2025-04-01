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
import { RoleGuard, Roles, TYPE_LOGIN } from 'src/guards/role.guard';
import { CategoryQuery } from './categoriesDTO/categories.query';

@Controller('categories')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(new LoggingInterceptor())
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  getAllCategory(@Query() query: CategoryQuery) {
    return this.categoryService.getAll(query);
  }

  @Get('/product')
  async getCategoryWithProduct(@Query() query: CategoryQuery) {
    return this.categoryService.getCategoryWithProduct(query);
  }

  @Post()
  @Roles(TYPE_LOGIN.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  createCategory(
    @Body() requestBody: createCategoryDto,
    @currentUser() currentUser: UserEntity,
  ) {
    return this.categoryService.create(requestBody, currentUser);
  }

  @Get('/:id')
  getCategoryById(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.findById(id);
  }

  @Put('/:id')
  @Roles(TYPE_LOGIN.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() requestBody: updateCategoryDto,
  ) {
    return this.categoryService.updateById(id, requestBody);
  }

  @Delete('/delete/:id')
  @Roles(TYPE_LOGIN.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.deleteCategory(id);
  }
}
