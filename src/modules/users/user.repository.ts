import { Repository } from 'typeorm';
import { UserEntity } from './userEntity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

export class UserRepository extends Repository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) {
    super(userRepo.target, userRepo.manager, userRepo.queryRunner);
  }

  findAllUsers() {
    return this.userRepo
      .createQueryBuilder('user')
      .where('user.role = :role', { role: 'USER' })
      .getMany();
  }
  findAllAdmin() {
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
      .innerJoinAndSelect(
        'product_entity',
        'product',
        'product.user_id=user.id',
      )
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
