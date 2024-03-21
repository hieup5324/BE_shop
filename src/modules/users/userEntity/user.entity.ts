import { Exclude } from 'class-transformer';
import { ProductEntity } from 'src/modules/products/entity/product.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { ROLE } from '../common/users-role.enum';
import { BaseEntityIdNumber } from 'src/common/base/entities/base.entity';
import { CategoryEntity } from 'src/modules/categories/entity/categories.entity';
import { OrderEntity } from 'src/modules/orders/entity/order.entity';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntityIdNumber {
  @Column({ unique: true, type: 'nvarchar' })
  email: string;

  @Column({ type: 'nvarchar' })
  @Exclude()
  passWord: string;

  @Column({ type: 'nvarchar' })
  firstName: string;

  @Column({ type: 'nvarchar' })
  lastName: string;

  @Column({ type: 'int' })
  age: number;

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
