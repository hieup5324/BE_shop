import { BaseEntityIdNumber } from 'src/common/base/entities/base.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderEntity } from './order.entity';

@Entity({ name: 'order-detail' })
export class OrderDetailEntity extends BaseEntityIdNumber {
  @Column({ name: 'user_id', nullable: true })
  userId: string;

  @Column({ type: 'boolean', default: false })
  is_paid: boolean;

  @Column({ type: 'varchar', nullable: true })
  note: string;

  @OneToOne(() => OrderEntity, (order) => order.orderDetail)
  order: OrderEntity;
}
