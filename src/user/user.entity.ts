import { Exclude } from 'class-transformer';
import { ProductEntity } from 'src/product/product.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

export enum ROLE {
  ADMIN = 'ADMIN',
  USER = 'USER'
}
@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  @Exclude()
  passWord: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: ROLE.USER})
  role: ROLE;
 
  @OneToMany(() => ProductEntity, (productEntity) => productEntity.user, {
    cascade: true,
  })
  product: ProductEntity[];
}

