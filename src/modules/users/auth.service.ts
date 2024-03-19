import { BadRequestException, Injectable, Request } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from './userDTO/registerUser.dto';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './userDTO/loginUser.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    @InjectQueue('send-email')
    private sendMail: Queue,
  ) {}
  async register(requestBody: RegisterUserDto) {
    const userByEmail = await this.userService.findByEmail(requestBody.email);
    if (userByEmail) {
      throw new BadRequestException('email ton tai');
    }
    await this.sendMail.add(
      'register',
      {
        to: requestBody.email,
        subject: 'Welcome to my shop',
        html: ` <p>Hi ${requestBody.firstName}, We understand that finding the perfect computer is more than just a purchase; it's an investment in your productivity, creativity, and enjoyment. That's why we're committed to offering a wide range of high-quality computers, accessories, and exceptional service to meet your needs.</p>
                <p>If you need additional assistance, or you received this email in error, please contact us at <a href="mminhvcvc1@gmail.com">Email</a></p>`,
        name: requestBody.firstName,
      },
      {
        removeOnComplete: true,
      },
    );
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
