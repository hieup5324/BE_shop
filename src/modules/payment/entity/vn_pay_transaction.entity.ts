import { BaseEntityIdNumber } from 'src/common/base/entities/base.entity';
import { OrderEntity } from 'src/modules/orders/entity/order.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity('vn-pay-transaction')
export class VnPayTransactionEntity extends BaseEntityIdNumber {
  @Column({ type: 'int', nullable: true })
  amount: number;

  @Column({ type: 'varchar', nullable: true })
  bank_code: string;

  @Column({ type: 'varchar', nullable: true })
  bank_tran_no: string;

  @Column({ type: 'varchar', nullable: true })
  card_type: string;

  @Column({ type: 'varchar', nullable: true })
  order_info: string;

  @Column({ type: 'timestamp', nullable: true })
  pay_date: Date;

  @Column({ type: 'varchar', nullable: true })
  response_code: string;

  @Column({ type: 'varchar', nullable: true })
  sercure_hash: string;

  @Column({ type: 'varchar', nullable: true })
  transaction_no: string;

  @Column({ type: 'varchar', nullable: true })
  transaction_status: string;

  @OneToOne(() => OrderEntity, (order) => order.vnPayTransaction, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'order_id',
    referencedColumnName: 'id',
  })
  order: OrderEntity;
}
