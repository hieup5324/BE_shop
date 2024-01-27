import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './userDTO/registerUser.dto';
import { LoginUserDto } from './userDTO/loginUser.dto';
import { currentUser } from './decorators/currentUser.decorator';
import { UserEntity } from './user.entity';
import { RoleGuard } from 'src/guards/role.guard';
import { UpdateUserDto } from './userDTO/updateUser.dto';

@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
    constructor(private userService: UserService, private authService : AuthService){}

    @Get()
    @UseGuards(new RoleGuard(['ADMIN', 'USER']))
    @UseGuards(AuthGuard)
    getAllUser() {
        return this.userService.findAll();
    }
    @Get('/getuser/:id')
    getUser(@Param('id') id: number){
        return this.userService.findById(id);
    }
    @Get('/current-user')
    @UseGuards(AuthGuard)
    getCurrentUser(@currentUser() currentUser : UserEntity) {
        return currentUser;
    }
    @Put('/update/:id')
    @UseGuards(new RoleGuard(['ADMIN', 'USER']))
    @UseGuards(AuthGuard)
    updateUser(@Param('id' , ParseIntPipe) id:number , @Body() requestbody: UpdateUserDto, @currentUser()  currentUser: UserEntity){
        return this.userService.updateById(id,requestbody,currentUser);
    }
    @Delete('/delete/:id')
    @UseGuards(AuthGuard)
    deleteById(@Param('id' , ParseIntPipe) id:number ,@currentUser() currentUser : UserEntity){
        return this.userService.deleteById(id, currentUser);
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
