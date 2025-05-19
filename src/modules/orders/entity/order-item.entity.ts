import { BaseEntityIdNumber } from 'src/common/base/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { OrderEntity } from './order.entity';
import { ProductEntity } from 'src/modules/products/entity/product.entity';

@Entity('order_items')
export class OrderItemEntity extends BaseEntityIdNumber {
  @ManyToOne(() => OrderEntity, (order) => order.orderItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id', referencedColumnName: 'id' })
  order: OrderEntity;

  @ManyToOne(() => ProductEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product: ProductEntity;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'int' })
  price: number;
}
