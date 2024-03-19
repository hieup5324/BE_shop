import { BadRequestException } from '@nestjs/common';
import { UserEntity } from './userEntity/user.entity';

export class Permission {
  static check(id: number, currentUser: UserEntity) {
    if (
      id === currentUser.id &&
      (currentUser.role === 'USER' || currentUser.role === 'ADMIN')
    )
      return;
    throw new BadRequestException('khong co quyen');
  }
}
