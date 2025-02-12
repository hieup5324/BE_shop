import { BaseEntityIdNumber } from 'src/common/base/entities/base.entity';
import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { OrderEntity } from '../orders/entity/order.entity';

export enum PaymentTypeEnum {
  CASH = 'cash',
  VNPAY = 'vnpay',
  MOMO = 'momo',
  PAYPAL = 'paypal',
}

@Entity({ name: 'invoice' })
export class InvoiceEntity extends BaseEntityIdNumber {
  @Column()
  paymentType: PaymentTypeEnum;

  @Column({ type: 'int', nullable: true })
  total_amount: number;

  @Column({ type: 'varchar', nullable: true })
  payment_status: string;

  @Column({ type: 'timestamp', nullable: true })
  paymentDate: Date;

  @OneToOne(() => OrderEntity)
  @JoinColumn({ name: 'order_id', referencedColumnName: 'id' })
  order: OrderEntity;
}
