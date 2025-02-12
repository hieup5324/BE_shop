import { Body, Controller, Post, Query } from '@nestjs/common';
import { LoginUserDto } from '../users/userDTO/loginUser.dto';
import { RegisterUserDto } from '../users/userDTO/registerUser.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async registerUser(@Body() requestbody: RegisterUserDto) {
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
}
