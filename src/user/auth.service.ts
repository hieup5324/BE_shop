import { BadRequestException, Injectable, Request } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from './userDTO/registerUser.dto';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './userDTO/loginUser.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private mailerService: MailerService,
  ) {}
  async register(requestBody: RegisterUserDto) {
    const userByEmail = await this.userService.findByEmail(requestBody.email);
    if (userByEmail) {
      throw new BadRequestException('email ton tai');
    }
    await this.mailerService.sendMail({
      to: requestBody.email,
      subject: 'welcome to my duck',
      html: ` <p>hey ${requestBody.firstName}, Please click below to confirm your email</p>
              <a href="https://nestjs.com/">confirm email</a>`,
      context: {
        name: requestBody.firstName,
      },
    });
    const hashedPw = await bcrypt.hash(requestBody.passWord, 10);

    requestBody.passWord = hashedPw;

    const saveUser = await this.userService.create(requestBody);
    const payload = {
      id: saveUser.id,
      email: saveUser.email,
      firtname: saveUser.firstName,
      lastname: saveUser.lastName,
      age: saveUser.age,
      role: saveUser.role,
    };

    const access_token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });

    return {
      msg: 'them user thanh cong',
      access_token,
    };
  }
  async login(requestBody: LoginUserDto) {
    const userByEmail = await this.userService.findByEmail(requestBody.email);
    if (!userByEmail) {
      throw new BadRequestException('tai khoan khong ton tai');
    }
    const checkpw = await bcrypt.compare(
      requestBody.passWord,
      userByEmail.passWord,
    );
    if (!checkpw) {
      throw new BadRequestException('sai mat khau');
    }

    const payload = {
      id: userByEmail.id,
      email: userByEmail.email,
      firtname: userByEmail.firstName,
      lastname: userByEmail.lastName,
      age: userByEmail.age,
      role: userByEmail.role,
    };
    const access_token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });

    return {
      msg: 'login thanh cong',
      access_token,
    };
  }
}
