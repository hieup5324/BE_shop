import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { LoggingInterceptor } from 'src/interceptor/logging.interceptor';
import { AuthGuard } from 'src/guards/auth.guard';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './userDTO/registerUser.dto';
import { LoginUserDto } from './userDTO/loginUser.dto';

@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(LoggingInterceptor)
export class UserController {
    constructor(private userService: UserService, private authService : AuthService){}

    @Get()
    @UseGuards(AuthGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    getAllUser() {
        return this.userService.findAll();
    }
    @Get('/:id')
    getUser(@Param('id') id: number){
        return this.userService.findById(id);
    }
    @Put('/:id')
    updateUser(@Param('id') id:number , @Body() requestbody: any){
        return this.userService.updateById(id,requestbody);
    }
    @Delete('/:id')
    deleteById(@Param('id') id:number){
        return this.userService.deleteById(id);
    }
    @Post('/register')
    registerUser(@Body() requestbody: RegisterUserDto){
        return this.authService.register(requestbody);
    }
    @Post('/login')
    LoginUser(@Body() requestbody: LoginUserDto){
        return this.authService.login(requestbody);
    }
}
