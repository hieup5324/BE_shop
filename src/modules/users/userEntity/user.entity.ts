import { Exclude } from 'class-transformer';
import { ProductEntity } from 'src/modules/products/entity/product.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { ROLE } from '../common/users-role.enum';
import { BaseEntityIdNumber } from 'src/common/base/entities/base.entity';
import { CategoryEntity } from 'src/modules/categories/entity/categories.entity';
import { OrderEntity } from 'src/modules/orders/entity/order.entity';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntityIdNumber {
  @Column({
    type: 'varchar',
    length: 128,
    name: 'password',
  })
  password: string;

  @Column({
    type: 'varchar',
    length: 128,
    name: 'auth0user_id',
    nullable: true,
  })
  auth0userId?: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'first_name',
  })
  firstName: string;

  @Column({
    type: 'varchar',
    length: 255,
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
    name: 'last_name',
  })
  lastName: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'phone',
    nullable: true,
  })
  phone?: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'type',
    nullable: true,
  })
  type?: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'address',
    nullable: true,
  })
  address?: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'photo_url',
    nullable: true,
  })
  photoUrl?: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'email',
  })
  email: string;

  @Column({
    type: 'date',
    name: 'date_of_birth',
    nullable: true,
  })
  dateOfBirth?: Date;

  @Column({ type: 'varchar', nullable: true })
  auth0user_token?: string;

  @Column({ type: 'enum', enum: ROLE, default: ROLE.USER })
  role: ROLE;

  @OneToMany(() => ProductEntity, (productEntity) => productEntity.users, {
    cascade: true,
  })
  products: ProductEntity[];

  @OneToMany(() => CategoryEntity, (categoryEntity) => categoryEntity.users, {
    cascade: true,
  })
  categories: CategoryEntity[];

  @OneToMany(() => OrderEntity, (order) => order.updatedBy)
  ordersUpdateBy: OrderEntity[];

  @OneToMany(() => OrderEntity, (order) => order.user)
  orders: OrderEntity[];
}
