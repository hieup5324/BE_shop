import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
export enum TYPE_LOGIN {
  ADMIN = 'ADMIN',
  USER = 'USER',
}
export const ROLES_KEY = 'roles';
export const Roles = (...roles: TYPE_LOGIN[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly ref: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.ref.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    let result = false;

    try {
      if (!requiredRoles) {
        return true;
      }

      const { currentUser } = context.switchToHttp().getRequest();
      const userRole = currentUser?.role;

      if (userRole) {
        result = requiredRoles.includes(userRole);
      }
    } catch (error) {
      throw new ForbiddenException('không có quyền truy cập');
    }

    if (!result) {
      throw new ForbiddenException('không có quyền truy cập');
    }

    return true;
  }
}
