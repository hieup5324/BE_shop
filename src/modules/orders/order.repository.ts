import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entity/order.entity';
import { OrderQuery } from './orderDTO/orders.query';
import * as moment from 'moment';

export class OrderRepository extends Repository<OrderEntity> {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepo: Repository<OrderEntity>,
  ) {
    super(orderRepo.target, orderRepo.manager, orderRepo.queryRunner);
  }

  async getOrders(userId: number, query: OrderQuery): Promise<any> {
    let { search, page, page_size, payment_status, to_date, from_date } = query;
    page = page && !isNaN(Number(page)) ? Number(page) : 1;
    page_size = page_size && !isNaN(Number(page_size)) ? Number(page_size) : 10;

    const queryBuilder = this.createQueryBuilder('orders');
    if (from_date) {
      queryBuilder.andWhere('orders.createdAt >= :from_date', { from_date });
    }

    if (to_date) {
      const toDate = new Date(to_date);
      toDate.setHours(23, 59, 59, 999);
      queryBuilder.andWhere('orders.createdAt <= :to_date', {
        to_date: toDate,
      });
    }

    if (search) {
      queryBuilder.where('orders.order_code LIKE :search', {
        search: `%${search}%`,
      });
    }

    if (payment_status) {
      queryBuilder.andWhere('orders.status_payment = :payment_status', {
        payment_status,
      });
    }

    const skip = (page - 1) * page_size;
    queryBuilder.skip(skip).take(page_size);
    queryBuilder.orderBy('orders.createdAt', 'DESC');
    queryBuilder.andWhere('orders.user_id = :userId', { userId });
    queryBuilder.leftJoinAndSelect('orders.orderItems', 'orderItems');
    queryBuilder.leftJoinAndSelect('orderItems.product', 'product');

    const [orders, total] = await queryBuilder.getManyAndCount();

    const result = orders.map((order) => ({
      ...order,
      orderItems: order.orderItems.map((item) => ({
        product_name: item.product?.product_name,
        quantity: item.quantity,
        total_price: item.price,
        price: item.product?.price,
        photo_url: item.product?.photo_url,
      })),
    }));
    return {
      data: result,
      paging: {
        total,
        page,
        page_size,
        totalPages: Math.ceil(total / page_size),
      },
    };
  }
}
