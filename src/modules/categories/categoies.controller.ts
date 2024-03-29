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
import { AuthGuard } from 'src/guards/auth.guard';
import { LoggingInterceptor } from 'src/interceptor/logging.interceptor';
import { currentUser } from '../users/decorators/currentUser.decorator';
import { UserEntity } from '../users/userEntity/user.entity';
import { createCategoryDto } from './categoriesDTO/createCategory.dto';
import { updateCategoryDto } from './categoriesDTO/updateCategory.dto';
import { CategoryService } from './categoies.service';
import { RoleGuard } from 'src/guards/role.guard';

@Controller('category')
@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(new LoggingInterceptor())
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post('/create')
  @UseGuards(new RoleGuard(['ADMIN']))
  createCategory(
    @Body() requestBody: createCategoryDto,
    @currentUser() currentUser: UserEntity,
  ) {
    return this.categoryService.create(requestBody, currentUser);
  }

  @Get()
  @UseGuards(new RoleGuard(['ADMIN']))
  getAllCategory() {
    return this.categoryService.getAll();
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
