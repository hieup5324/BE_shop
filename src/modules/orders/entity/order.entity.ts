import { BaseEntityIdNumber } from 'src/common/base/entities/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { OrderStatus } from '../enum/order-status.enum';
import { UserEntity } from 'src/modules/users/userEntity/user.entity';
import { ShippingEntity } from './shipping.entity';
import { OrdersProductsEntity } from './order-product.entity';

@Entity('order')
export class OrderEntity extends BaseEntityIdNumber {
  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PROCESSING })
  status: string;

  @Column({ nullable: true })
  shippedAt: Date;

  @Column({ nullable: true })
  deliveredAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.ordersUpdateBy)
  updatedBy: UserEntity;

  @OneToOne(() => ShippingEntity, (ship) => ship.order, { cascade: true })
  @JoinColumn()
  shippingAddress: ShippingEntity;

  @OneToMany(() => OrdersProductsEntity, (op) => op.order, { cascade: true })
  products: OrdersProductsEntity[];

  @ManyToOne(() => UserEntity, (user) => user.orders)
  user: UserEntity;
}
