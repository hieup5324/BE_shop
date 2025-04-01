import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/modules/users/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService, // ✅ Được inject từ UserModule thông qua AuthModule
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      const token = request.headers.authorization?.split(' ')[1];
      if (!token) throw new ForbiddenException('Token không hợp lệ');

      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      const user = await this.userService.findByEmail(payload.email);
      if (!user) throw new BadRequestException('Người dùng không tồn tại');

      request.currentUser = user;
      return true;
    } catch (error) {
      throw new ForbiddenException('Token hết hạn hoặc không hợp lệ');
    }
  }
}
