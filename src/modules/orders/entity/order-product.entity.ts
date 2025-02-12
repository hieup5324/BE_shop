import { BaseEntityIdNumber } from 'src/common/base/entities/base.entity';
import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';
import { OrderStatus } from '../enum/order-status.enum';
import { UserEntity } from 'src/modules/users/userEntity/user.entity';
import { ShippingEntity } from './shipping.entity';
import { ProductEntity } from 'src/modules/products/entity/product.entity';
import { OrderEntity } from './order.entity';

// @Entity('order_product')
// export class OrdersProductsEntity extends BaseEntityIdNumber {
//   @Column({
//     type: 'float',
//     default: 0,
//   })
//   product_unit_price: number;

//   @Column()
//   product_quantity: number;

//   @ManyToOne(() => OrderEntity, (order) => order.products)
//   order: OrderEntity;

//   @ManyToOne(() => ProductEntity, (prod) => prod.products, { cascade: true })
//   product: ProductEntity;
// }
