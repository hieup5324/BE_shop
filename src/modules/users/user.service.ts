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

  findAllUser() {
    return this.usersRepo.findAllUsers();
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
    if (requestBody.role) {
      throw new BadRequestException('Không thể thay đổi role');
    }
    let user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    Permission.check(id, currentUser);

    if (requestBody.passWord) {
      const hashedPw = await bcrypt.hash(requestBody.passWord, 10);
      requestBody.passWord = hashedPw;
    }

    user = { ...user, ...requestBody };

    const updateUser = await this.usersRepo.save(user);

    return {
      email: updateUser.email,
    };
  }

  async deleteById(id: number, currentUser: UserEntity) {
    let user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('không tìm thấy người dùng');
    }
    Permission.check(id, currentUser);
    return this.usersRepo.remove(user);
  }
}
