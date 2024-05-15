import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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
    const user = await this.userService.findByEmail(requestBody.email);
    if (user) {
      throw new BadRequestException('Email đã tồn tại');
    }
    if (requestBody.role) {
      throw new BadRequestException('Không có quyền chọn Role');
    }
    await this.sendMail.add(
      'register',
      {
        to: requestBody.email,
        subject: 'Welcome to my shop',
        html: ` <p>Hi ${requestBody.fullname}, We understand that finding the perfect computer is more than just a purchase; it's an investment in your productivity, creativity, and enjoyment. That's why we're committed to offering a wide range of high-quality computers, accessories, and exceptional service to meet your needs.</p>
                <p>If you need additional assistance, or you received this email in error, please contact us at <a href="mminhvcvc1@gmail.com">Email</a></p>`,
        name: requestBody.fullname,
      },
      {
        removeOnComplete: true,
      },
    );
    const hashedPw = await bcrypt.hash(requestBody.password, 10);

    requestBody.password = hashedPw;
    console.log(requestBody);
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
}
