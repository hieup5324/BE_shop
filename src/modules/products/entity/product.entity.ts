import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { UserEntity } from '../../users/userEntity/user.entity';
import { BaseEntityIdNumber } from 'src/common/base/entities/base.entity';
import { CategoryEntity } from 'src/modules/categories/entity/categories.entity';
import { OrdersProductsEntity } from 'src/modules/orders/entity/order-product.entity';

@Entity('product')
export class ProductEntity extends BaseEntityIdNumber {
  @Column({ unique: true })
  nameProduct: string;

  @Column()
  nameDescription: string;

  @Column({ default: 0 })
  price: number;

  @Column()
  stock: number;

  @Column('simple-array')
  images: string[];

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.products, {
    onDelete: 'CASCADE',
  })
  // @Transform(({ obj }) => obj.user.id)
  users: UserEntity;

  @ManyToOne(() => CategoryEntity, (categoryEntity) => categoryEntity.products)
  categories: CategoryEntity;

  @OneToMany(() => OrdersProductsEntity, (op) => op.product)
  products: OrdersProductsEntity[];
}
