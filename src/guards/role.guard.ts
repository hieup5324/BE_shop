import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private role: string[]) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('RoleGuard');
    const request = context.switchToHttp().getRequest();
    console.log('RoleGuard', request.currentUser);

    if (!this.role.includes(request.currentUser.role)) {
      throw new BadRequestException('Không có quyền thực hiện');
    }
    return true;
  }
}
