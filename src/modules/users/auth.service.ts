import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from './userDTO/registerUser.dto';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { LoginUserDto } from './userDTO/loginUser.dto';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}
  async register(requestBody: RegisterUserDto) {
    const user = await this.userService.findByEmail(requestBody.email);
    if (user) {
      throw new BadRequestException('Email đã tồn tại');
    }
    if (requestBody.role) {
      throw new BadRequestException('Không có quyền chọn Role');
    }
    const hashedPw = await bcrypt.hash(requestBody.password, 10);

    requestBody.password = hashedPw;
    this.sendMail(requestBody.email);
    const User = await this.userService.create(requestBody);
    const payload = {
      id: User.id,
      email: User.email,
    };
    const access_token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });
    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET_REFRESH,
      expiresIn: '7d',
    });
    return {
      msg: 'tạo tài khoản thành công',
      access_token,
      refresh_token,
      User,
    };
  }

  async login(requestBody: LoginUserDto) {
    const user = await this.userService.findByEmail(requestBody.email);
    if (!user) {
      throw new BadRequestException('tài khoản không tồn tại');
    }
    const checkpw = await bcrypt.compare(requestBody.password, user.password);
    if (!checkpw) {
      throw new BadRequestException('sai mật khẩu');
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    const access_token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });
    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET_REFRESH,
      expiresIn: '7d',
    });

    return {
      msg: 'đăng nhập thành công',
      access_token,
      refresh_token,
      user,
    };
  }

  async createToken(token: string) {
    let payload: any;
    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
    delete payload.exp;
    const newToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '7d',
    });

    return { access_token: newToken };
  }

  async sendMail(email: string) {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: +process.env.MAIL_PORT,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
    await transporter.sendMail({
      from: '"Shop Lap" <mminhvcvc1@gmail.com>',
      to: email,
      subject: 'Hello new user',
      html:
        '<b>Hello new user?</b>' +
        '<p>Chúc mừng bạn đã đăng ký thành công tài khoản tại Shop Lap!</p>',
    });
  }
}
