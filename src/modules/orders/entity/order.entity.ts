import { BaseEntityIdNumber } from 'src/common/base/entities/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { UserEntity } from 'src/modules/users/userEntity/user.entity';
import { VnPayTransactionEntity } from 'src/modules/payment/entity/vn_pay_transaction.entity';
import {
  ORDER_STATUS,
  PAYMENT_STATUS,
  PAYMENT_TYPE,
} from 'src/modules/shared/constants/common';
import { OrderItemEntity } from './order-item.entity';

@Entity('order')
export class OrderEntity extends BaseEntityIdNumber {
  @Column({ type: 'varchar', unique: true, length: 20 })
  order_code: string;

  @Column({ type: 'int', nullable: false })
  total_price: number;

  @Column({
    type: 'enum',
    enum: ORDER_STATUS,
    default: ORDER_STATUS.PENDING,
  })
  status: ORDER_STATUS;

  @Column({ type: 'enum', enum: PAYMENT_TYPE, nullable: true })
  payment_type: PAYMENT_TYPE;

  @Column({
    type: 'enum',
    enum: PAYMENT_STATUS,
    default: PAYMENT_STATUS.PENDING,
  })
  status_payment: PAYMENT_STATUS;

  @ManyToOne(() => UserEntity, (user) => user.orders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @OneToOne(() => VnPayTransactionEntity, (transaction) => transaction.order, {
    nullable: true,
  })
  @JoinColumn({ name: 'transaction_id', referencedColumnName: 'id' })
  vnPayTransaction: VnPayTransactionEntity;

  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.order, {
    cascade: true,
  })
  orderItems: OrderItemEntity[];
}
