import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { VnPayTransactionEntity } from './entity/vn_pay_transaction.entity';
import { TransactionQuery } from './dto/transaction.query';

export class VNpayRepository extends Repository<VnPayTransactionEntity> {
  constructor(
    @InjectRepository(VnPayTransactionEntity)
    private productRepo: Repository<VnPayTransactionEntity>,
  ) {
    super(productRepo.target, productRepo.manager, productRepo.queryRunner);
  }

  async getTransaction(query: TransactionQuery): Promise<any> {
    let { search, page, page_size } = query;
    console.log('query', query);
    page = page && !isNaN(Number(page)) ? Number(page) : 1;
    page_size = page_size && !isNaN(Number(page_size)) ? Number(page_size) : 10;

    const queryBuilder = this.createQueryBuilder('Transactions');
    // if (search) {
    //   queryBuilder.andWhere('categories.name LIKE :search', {
    //     search: `%${search}%`,
    //   });
    // }

    const skip = (page - 1) * page_size;
    queryBuilder.skip(skip).take(page_size);
    queryBuilder.orderBy('Transactions.createdAt', 'DESC');

    const [transactions, total] = await queryBuilder.getManyAndCount();
    return {
      data: transactions,
      paging: {
        total,
        page,
        page_size,
        totalPages: Math.ceil(total / page_size),
      },
    };
  }
}
