import { Exclude } from 'class-transformer';
import { ProductEntity } from 'src/modules/products/entity/product.entity';
import { Entity, Column, OneToMany, OneToOne } from 'typeorm';
import { ROLE } from '../common/users-role.enum';
import { BaseEntityIdNumber } from 'src/common/base/entities/base.entity';
import { CategoryEntity } from 'src/modules/categories/entity/categories.entity';
import { OrderEntity } from 'src/modules/orders/entity/order.entity';
import { CartEntity } from 'src/modules/cart/entity/cart.entity';
import { USER_TYPE } from 'src/modules/shared/constants/common';
import { ChatRoomEntity } from 'src/modules/chat-socket/entity/chat-room.entity';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntityIdNumber {
  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({ type: 'varchar', nullable: true })
  auth0user_id?: string;

  @Column({ type: 'varchar', nullable: true })
  first_name: string;

  @Column({ type: 'varchar', nullable: true })
  last_name: string;

  @Column({ type: 'varchar', nullable: true })
  phone?: string;

  @Column({ type: 'varchar', default: USER_TYPE.GENERAL })
  type: string;

  @Column({ type: 'varchar', nullable: true })
  photo_url?: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'date', nullable: true })
  date_of_birth?: Date;

  @Column({ type: 'varchar', nullable: true })
  auth0user_token?: string;

  @Column({ type: 'enum', enum: ROLE, default: ROLE.CUSTOMER })
  role: ROLE;

  @OneToMany(() => ProductEntity, (productEntity) => productEntity.user, {
    cascade: true,
  })
  products: ProductEntity[];

  @OneToMany(() => CategoryEntity, (categoryEntity) => categoryEntity.user, {
    cascade: true,
  })
  categories: CategoryEntity[];

  @OneToMany(() => OrderEntity, (order) => order.user)
  orders: OrderEntity[];

  @OneToOne(() => CartEntity, (cart) => cart.user, { cascade: true })
  cart: CartEntity;

  @OneToMany(() => ChatRoomEntity, (room) => room.customer)
  customer_rooms: ChatRoomEntity[];
}
