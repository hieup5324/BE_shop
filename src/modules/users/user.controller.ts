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
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './userDTO/registerUser.dto';
import { LoginUserDto } from './userDTO/loginUser.dto';
import { currentUser } from './decorators/currentUser.decorator';
import { UserEntity } from './userEntity/user.entity';
import { RoleGuard } from 'src/guards/role.guard';
import { UpdateUserDto } from './userDTO/updateUser.dto';
import { LoggingInterceptor } from 'src/interceptor/logging.interceptor';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(LoggingInterceptor)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('/register')
  async registerUser(@Body() requestbody: RegisterUserDto) {
    console.log('dame');
    return await this.authService.register(requestbody);
  }

  @Post('/login')
  LoginUser(@Body() requestbody: LoginUserDto) {
    return this.authService.login(requestbody);
  }

  @Post('/refresh-token')
  async refreshToken(@Query('token') token: string) {
    return this.authService.createToken(token);
  }

  @Get()
  @UseGuards(new RoleGuard(['ADMIN']))
  @UseGuards(AuthGuard)
  getAllUser() {
    return this.userService.findAllUser();
  }

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

  @Put('/update/:id')
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
