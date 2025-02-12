import { BaseEntityIdNumber } from 'src/common/base/entities/base.entity';
import { ProductEntity } from 'src/modules/products/entity/product.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CartEntity } from './cart.entity';

@Entity('cart_item')
export class CartItemEntity extends BaseEntityIdNumber {
  @ManyToOne(() => CartEntity, (cart) => cart.cartItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'cart_id', referencedColumnName: 'id' })
  cart: CartEntity;

  @ManyToOne(() => ProductEntity)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product: ProductEntity;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'int' })
  price: number;
}
