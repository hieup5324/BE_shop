import { BaseEntityIdNumber } from 'src/common/base/entities/base.entity';
import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';
import { OrderStatus } from '../enum/order-status.enum';
import { UserEntity } from 'src/modules/users/userEntity/user.entity';
import { OrderEntity } from './order.entity';

@Entity('shipping')
export class ShippingEntity extends BaseEntityIdNumber {
  @Column()
  phone: string;

  @Column({ default: ' ' })
  name: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  postCode: string;

  @Column()
  state: string;

  @Column()
  country: string;

  // @OneToOne(() => OrderEntity, (order) => order.shippingAddress)
  // order: OrderEntity;
}
