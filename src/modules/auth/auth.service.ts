import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from '../users/userDTO/registerUser.dto';
import { UserService } from '../users/user.service';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { LoginUserDto } from '../users/userDTO/loginUser.dto';
import { In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CartEntity } from '../cart/entity/cart.entity';
import { CartRepository } from '../cart/cart.repository';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private cartRepo: CartRepository,
  ) {}
  async register(requestBody: RegisterUserDto) {
    let { email, password } = requestBody;
    const userDB = await this.userService.findByEmail(email);
    if (userDB) {
      throw new BadRequestException('Email đã tồn tại');
    }
    if (requestBody.role) {
      throw new BadRequestException('Không có quyền chọn Role');
    }
    const hashedPw = await bcrypt.hash(password, 10);

    requestBody.password = hashedPw;
    // this.sendMail(requestBody.email);

    const user = await this.userService.create(requestBody);
    const cart = this.cartRepo.create({ user });
    await this.cartRepo.save(cart);

    const payload = {
      id: user.id,
      email: user.email,
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
      user,
    };
  }

  async login(requestBody: LoginUserDto) {
    const { email, password } = requestBody;
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('tài khoản không tồn tại');
    }
    const checkpw = await bcrypt.compare(password, user.password);
    if (!checkpw) {
      throw new BadRequestException('sai mật khẩu');
    }

    let cart = await this.cartRepo.findOne({
      where: { user: { id: user.id } },
    });
    if (!cart) {
      cart = this.cartRepo.create({ user });
      await this.cartRepo.save(cart);
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
