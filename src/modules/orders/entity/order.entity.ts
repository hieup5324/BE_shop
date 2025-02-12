import { BaseEntityIdNumber } from 'src/common/base/entities/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { OrderStatus } from '../enum/order-status.enum';
import { UserEntity } from 'src/modules/users/userEntity/user.entity';
import { ShippingEntity } from './shipping.entity';
// import { OrdersProductsEntity } from './order-product.entity';
import { OrderDetailEntity } from './order-detail.entity';
import { ProductEntity } from 'src/modules/products/entity/product.entity';
import { VnPayTransactionEntity } from 'src/modules/payment/entity/vn_pay_transaction.entity';

@Entity('order')
export class OrderEntity extends BaseEntityIdNumber {
  @Column({ name: 'amount', type: 'int' })
  amount: number;

  @Column({ name: 'price', type: 'int' })
  price: number;

  @OneToOne(() => OrderDetailEntity, (orderDetail) => orderDetail.order, {
    cascade: true,
  })
  @JoinColumn({ name: 'order_detail_id', referencedColumnName: 'id' })
  orderDetail: OrderDetailEntity;

  @ManyToOne(() => ProductEntity)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product: ProductEntity;

  @ManyToOne(() => UserEntity, (user) => user.orders)
  user: UserEntity;

  @OneToOne(() => VnPayTransactionEntity, (transaction) => transaction.order)
  vnPayTransaction: VnPayTransactionEntity;
}
