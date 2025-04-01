import { Repository } from 'typeorm';
import { UserEntity } from './userEntity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ROLE } from './common/users-role.enum';
import { UserQuery } from './userDTO/user.query';
// import * as dayjs from 'dayjs';

export class UserRepository extends Repository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) {
    super(userRepo.target, userRepo.manager, userRepo.queryRunner);
  }

  // async findAllUsers() {
  //   const findUser = await this.userRepo.find({
  //     where: { role: ROLE.USER },
  //     select: [
  //       'id',
  //       'createdAt',
  //       'fullname',
  //       'dob',
  //       'email',
  //       'gender',
  //       'phone',
  //       'active',
  //       'role',
  //     ],
  //   });
  //   return findUser.map((user) => ({
  //     ...user,
  //     createdAt: dayjs(user.createdAt).format('DD-MM-YYYY'),
  //     dob: dayjs(user.dob).format('DD-MM-YYYY'),
  //   }));
  //

  async findUser(query: UserQuery): Promise<any> {
    let { search, page, page_size } = query;

    page = page && !isNaN(Number(page)) ? Number(page) : 1;
    page_size = page_size && !isNaN(Number(page_size)) ? Number(page_size) : 10;

    const queryBuilder = this.createQueryBuilder('users');

    if (search) {
      queryBuilder.andWhere('users.email LIKE :search', {
        search: `%${search}%`,
      });
    }

    const skip = (page - 1) * page_size;
    queryBuilder.skip(skip).take(page_size);

    const [users, total] = await queryBuilder.getManyAndCount();

    return {
      data: users,
      paging: {
        total,
        page,
        page_size,
        totalPages: Math.ceil(total / page_size),
      },
    };
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
