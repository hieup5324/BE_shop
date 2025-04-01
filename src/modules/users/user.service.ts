import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserEntity } from './userEntity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from './userDTO/updateUser.dto';
import { RegisterUserDto } from './userDTO/registerUser.dto';
import { Permission } from './checkPermission.service';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './user.repository';
import { ROLE } from './common/users-role.enum';
import { ChangePasswordDto } from './userDTO/change-password.dto';
import { query } from 'express';
import { UserQuery } from './userDTO/user.query';

@Injectable()
export class UserService {
  constructor(
    private readonly usersRepo: UserRepository,
    // private readonly repo: Repository<UserEntity>,
  ) {}

  create(requestbody: RegisterUserDto) {
    const user = this.usersRepo.create(requestbody);
    return this.usersRepo.save(user);
  }

  async findAllUser(query: UserQuery) {
    return await this.usersRepo.findUser(query);
  }

  async changePassword(userId: number, userInput: ChangePasswordDto) {
    const user = await this.usersRepo.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { oldPassword, newPassword } = userInput;
    const checkpw = await bcrypt.compare(oldPassword, user.password);
    if (!checkpw) {
      throw new BadRequestException('Mật khẩu cũ không đúng');
    }
    const hashedPw = await bcrypt.hash(newPassword, 10);

    user.password = hashedPw;
    await this.usersRepo.save(user);
    return { msg: 'Đổi mật khẩu thành công' };
  }

  findAllAdmin() {
    return this.usersRepo.findAllAdmin();
  }

  groupByRoleCount() {
    return this.usersRepo.groupByRoleCount();
  }

  userProduct() {
    return this.usersRepo.userProduct();
  }
  userGroup() {
    return this.usersRepo.userGroup();
  }
  async findById(id: number) {
    const user = await this.usersRepo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }
    return user;
  }

  findByEmail(email: string) {
    return this.usersRepo.findOneBy({ email });
  }

  async updateById(
    id: number,
    requestBody: UpdateUserDto,
    currentUser: UserEntity,
  ) {
    if (requestBody.role !== ROLE.USER) {
      throw new BadRequestException('Không thể thay đổi role');
    }
    let user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    Permission.check(id, currentUser);

    if (requestBody.password) {
      const hashedPw = await bcrypt.hash(requestBody.password, 10);
      requestBody.password = hashedPw;
    }

    user = { ...user, ...requestBody };

    const updateUser = await this.usersRepo.save(user);

    return {
      msg: 'Cập nhật thành công',
    };
  }

  async deleteById(id: number, currentUser: UserEntity) {
    let user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('không tìm thấy người dùng');
    }
    Permission.check(id, currentUser);
    await this.usersRepo.remove(user);
    return {
      msg: 'Xóa người dùng thành công',
    };
  }
}
