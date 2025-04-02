import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entity/order.entity';
import { OrderQuery } from './orderDTO/orders.query';

export class OrderRepository extends Repository<OrderEntity> {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepo: Repository<OrderEntity>,
  ) {
    super(orderRepo.target, orderRepo.manager, orderRepo.queryRunner);
  }

  async getOrders(query: OrderQuery): Promise<any> {
    let { search, page, page_size } = query;
    console.log('query', query);
    page = page && !isNaN(Number(page)) ? Number(page) : 1;
    page_size = page_size && !isNaN(Number(page_size)) ? Number(page_size) : 10;

    const queryBuilder = this.createQueryBuilder('orders');
    // console.log('queryBuilder', queryBuilder);
    // if (search) {
    //   queryBuilder.andWhere('categories.name LIKE :search', {
    //     search: `%${search}%`,
    //   });
    // }

    const skip = (page - 1) * page_size;
    queryBuilder.skip(skip).take(page_size);

    const [orders, total] = await queryBuilder.getManyAndCount();
    console.log('orders', orders);
    return {
      data: orders,
      paging: {
        total,
        page,
        page_size,
        totalPages: Math.ceil(total / page_size),
      },
    };
  }
}
