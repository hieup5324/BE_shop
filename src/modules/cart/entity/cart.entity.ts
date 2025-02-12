import { BaseEntityIdNumber } from 'src/common/base/entities/base.entity';
import { UserEntity } from 'src/modules/users/userEntity/user.entity';
import { Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { CartItemEntity } from './cart-item.entity';

@Entity('cart')
export class CartEntity extends BaseEntityIdNumber {
  @OneToOne(() => UserEntity, (user) => user.cart, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @OneToMany(() => CartItemEntity, (cartItem) => cartItem.cart, {
    cascade: true,
  })
  cartItems: CartItemEntity[];
}
