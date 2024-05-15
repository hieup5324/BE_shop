import { Exclude } from 'class-transformer';
import { ProductEntity } from 'src/modules/products/entity/product.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { ROLE } from '../common/users-role.enum';
import { BaseEntityIdNumber } from 'src/common/base/entities/base.entity';
import { CategoryEntity } from 'src/modules/categories/entity/categories.entity';
import { OrderEntity } from 'src/modules/orders/entity/order.entity';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntityIdNumber {
  @Column({ type: 'nvarchar' })
  fullname: string;

  @Column({ type: 'timestamp', nullable: true })
  dob: Date;

  @Column({ unique: true, type: 'nvarchar' })
  email: string;

  @Column({ type: 'nvarchar' })
  gender: string;

  @Column({ type: 'nvarchar' })
  phone: string;

  @Column({ type: 'nvarchar' })
  @Exclude()
  password: string;

  @Column({ type: 'enum', enum: ROLE, default: ROLE.USER })
  role: ROLE;

  @Column({ type: 'boolean', default: true })
  active: boolean;

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
