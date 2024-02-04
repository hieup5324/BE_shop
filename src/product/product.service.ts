import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { ProductEntity } from './product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { createProductDto } from './productDTO/createProduct.dto';
import { UserEntity } from 'src/user/userEntity/user.entity';
import { updateProductDto } from './productDTO/updateProduct.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepo: Repository<ProductEntity>,
  ) {}

  create(requestBody: createProductDto, currentUser: UserEntity) {
    const product = this.productRepo.create(requestBody);
    product.user = currentUser;
    return this.productRepo.save(product);
  }

  getAll() {
    return this.productRepo.find();
  }

  async findOneByOption(option: FindOptionsWhere<any>) {
    const product = await this.productRepo.findOneBy(option);
    return product;
  }

  async findById(id: number) {
    const product = await this.productRepo.findOneBy({ id });
    if (!product) {
      throw new NotFoundException('sản phẩm không tồn tại');
    }
    return product;
  }

  async updateById(
    id: number,
    requestBody: updateProductDto,
    currentUser: UserEntity,
  ) {
    let product = await this.findOneByOption({
      id: id,
      user_id: currentUser.id,
    });

    if (!product) {
      throw new NotFoundException('không có product này or không có quyền');
    }

    product = { ...product, ...requestBody };

    const updateProduct = this.productRepo.save(product);
    return updateProduct;
  }

  async deleteProduct(id: number, currentUser: UserEntity) {
    let product = await this.findOneByOption({
      id: id,
      user_id: currentUser.id,
    });
    if (!product) {
      throw new NotFoundException('không có product này');
    }
    return this.productRepo.remove(product);
  }
}
