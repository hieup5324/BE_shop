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
import { UserGroupEntity } from './userEntity/user-group.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly usersRepo: UserRepository,
    @InjectRepository(UserGroupEntity)
    private usergroupRepo: Repository<UserGroupEntity>,
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
      throw new NotFoundException('nice try');
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
      throw new BadRequestException('khong co quyen doi role');
    }
    let user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User does not exsits');
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
      fistname: updateUser.firstName,
      lastname: updateUser.lastName,
    };
  }

  async joinGroup(
    joinGroup: { userId: number; groupId: number },
    currentUser: UserEntity,
  ) {
    const user = await this.usersRepo.findOne({
      where: { id: joinGroup.userId },
      relations: ['group'],
    });
    if (!user) {
      throw new NotFoundException('User does not exsits');
    }

    Permission.check(joinGroup.userId, currentUser);

    const checkexist = user.group.find(
      (group) => group.id === joinGroup.groupId,
    );
    if (checkexist) {
      throw new BadRequestException('User is already a member of this group');
    }

    await this.usergroupRepo.save(joinGroup);
    return 'add successful';
  }

  async deleteById(id: number, currentUser: UserEntity) {
    let user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('ko co user nay');
    }
    Permission.check(id, currentUser);
    return this.usersRepo.remove(user);
  }
}
