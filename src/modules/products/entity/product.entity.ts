import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { UserEntity } from '../../users/userEntity/user.entity';
import { BaseEntityIdNumber } from 'src/common/base/entities/base.entity';
import { CategoryEntity } from 'src/modules/categories/entity/categories.entity';
import { OrdersProductsEntity } from 'src/modules/orders/entity/order-product.entity';

@Entity('product')
export class ProductEntity extends BaseEntityIdNumber {
  @Column({
    name: 'product_name',
    type: 'varchar',
    length: 100,
  })
  productName: string;

  @Column({
    name: 'type',
    type: 'varchar',
    length: 100,
  })
  type: string;

  @Column({
    name: 'price',
    type: 'int',
  })
  price: number;

  @Column({
    name: 'final_price',
    type: 'int',
    nullable: true,
  })
  finalPrice: number;

  @Column({
    name: 'has_discount',
    type: 'boolean',
    default: false,
  })
  hasDiscount: boolean;

  @Column({
    name: 'description',
    type: 'varchar',
    nullable: true,
    length: 100,
  })
  description: string;

  @Column({
    name: 'photoUrl',
    type: 'varchar',
    nullable: true,
    length: 1000,
  })
  photoUrl: string;

  @Column({
    name: 'quantity',
    type: 'int',
  })
  quantity: number;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.products, {
    onDelete: 'CASCADE',
  })
  // @Transform(({ obj }) => obj.user.id)
  users: UserEntity;

  @ManyToOne(() => CategoryEntity)
  @JoinColumn({
    name: 'category_id',
    referencedColumnName: 'id',
  })
  categories: CategoryEntity;

  @OneToMany(() => OrdersProductsEntity, (op) => op.product)
  products: OrdersProductsEntity[];
}
