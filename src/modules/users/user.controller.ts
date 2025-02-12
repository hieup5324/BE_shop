import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { AuthService } from '../auth/auth.service';
import { RegisterUserDto } from './userDTO/registerUser.dto';
import { LoginUserDto } from './userDTO/loginUser.dto';
import { currentUser } from '../shared/decorators/currentUser.decorator';
import { UserEntity } from './userEntity/user.entity';
import { RoleGuard } from 'src/guards/role.guard';
import { UpdateUserDto } from './userDTO/updateUser.dto';
import { LoggingInterceptor } from 'src/interceptor/logging.interceptor';
import { ChangePasswordDto } from './userDTO/change-password.dto';
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(LoggingInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/change-password/:userId')
  async changePassword(
    @Param('userId') id: number,
    @Body() userInput: ChangePasswordDto,
  ) {
    return this.userService.changePassword(id, userInput);
  }

  // @Get()
  // @UseGuards(new RoleGuard(['ADMIN']))
  // @UseGuards(AuthGuard)
  // getAllUser() {
  //   return this.userService.findAllUser();
  // }

  @Get('/admin')
  @UseGuards(new RoleGuard(['ADMIN']))
  @UseGuards(AuthGuard)
  getAllAdmin() {
    return this.userService.findAllAdmin();
  }

  @Get('/role_count')
  @UseGuards(new RoleGuard(['ADMIN']))
  @UseGuards(AuthGuard)
  groupByRoleCount() {
    return this.userService.groupByRoleCount();
  }

  @Get('/product')
  // @UseGuards(AuthGuard)
  userProduct() {
    return this.userService.userProduct();
  }

  @Get('/group')
  // @UseGuards(AuthGuard)
  userGroup() {
    return this.userService.userGroup();
  }

  @Get('/getuser/:id')
  getUser(@Param('id') id: number) {
    return this.userService.findById(id);
  }

  @Get('/current-user')
  @UseGuards(AuthGuard)
  getCurrentUser(@currentUser() currentUser: UserEntity) {
    return currentUser;
  }

  @Patch('/update/:id')
  @UseGuards(new RoleGuard(['ADMIN', 'USER']))
  @UseGuards(AuthGuard)
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() requestbody: UpdateUserDto,
    @currentUser() currentUser: UserEntity,
  ) {
    return this.userService.updateById(id, requestbody, currentUser);
  }

  @Delete('/delete/:id')
  @UseGuards(AuthGuard)
  deleteById(
    @Param('id', ParseIntPipe) id: number,
    @currentUser() currentUser: UserEntity,
  ) {
    return this.userService.deleteById(id, currentUser);
  }
}
