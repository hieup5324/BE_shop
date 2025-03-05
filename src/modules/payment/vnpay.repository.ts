import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { VnPayTransactionEntity } from './entity/vn_pay_transaction.entity';

export class VNpayRepository extends Repository<VnPayTransactionEntity> {
  constructor(
    @InjectRepository(VnPayTransactionEntity)
    private productRepo: Repository<VnPayTransactionEntity>,
  ) {
    super(productRepo.target, productRepo.manager, productRepo.queryRunner);
  }
}
