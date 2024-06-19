import { Repository } from 'typeorm';
import { UserEntity } from './userEntity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ROLE } from './common/users-role.enum';
import * as dayjs from 'dayjs';

export class UserRepository extends Repository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) {
    super(userRepo.target, userRepo.manager, userRepo.queryRunner);
  }

  async findAllUsers() {
    const findUser = await this.userRepo.find({
      where: { role: ROLE.USER },
      select: [
        'id',
        'createdAt',
        'fullname',
        'dob',
        'email',
        'gender',
        'phone',
        'active',
        'role',
      ],
    });
    return findUser.map((user) => ({
      ...user,
      createdAt: dayjs(user.createdAt).format('DD-MM-YYYY'),
      dob: dayjs(user.dob).format('DD-MM-YYYY'),
    }));
  }
  findAllAdmin(): Promise<UserEntity[]> {
    return this.userRepo
      .createQueryBuilder('user')
      .where('user.role = :role', { role: 'ADMIN' })
      .getMany();
  }
  async groupByRoleCount() {
    return this.createQueryBuilder('user')
      .select('user.role AS role, COUNT(*) AS count')
      .groupBy('user.role')
      .getRawMany();
  }
  async userProduct() {
    const users = await this.userRepo
      .createQueryBuilder('user')
      .select('user.id', 'id')
      .addSelect('user.email', 'email')
      .addSelect('user.firstName', 'firstName')
      .addSelect('user.lastName', 'lastName')
      .innerJoinAndSelect('product', 'product', 'product.usersId=user.id')
      .getRawMany();
    return users;
  }

  async userGroup() {
    return await this.userRepo
      .createQueryBuilder('user')
      .select('user.id', 'id')
      .addSelect('user.email', 'email')
      .addSelect('user.firstName', 'firstName')
      .addSelect('user.lastName', 'lastName')
      .innerJoinAndSelect('user.group', 'group')
      .getRawMany();
  }
}
