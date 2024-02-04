import { Exclude } from 'class-transformer';
import { CardEntity } from 'src/card/card.entity';
import { GroupEntity } from 'src/group/group.entity';
import { ProductEntity } from 'src/product/product.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  JoinColumn,
  OneToOne,
} from 'typeorm';

export enum ROLE {
  ADMIN = 'ADMIN',
  USER = 'USER',
}
@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  passWord: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: ROLE.USER })
  role: ROLE;

  @OneToOne(() => CardEntity, (card) => card.user, {
    cascade: true,
  })
  @JoinColumn()
  card: CardEntity;

  @OneToMany(() => ProductEntity, (productEntity) => productEntity.user, {
    cascade: true,
  })
  product: ProductEntity[];

  @ManyToMany(() => GroupEntity, (groupEntity) => groupEntity.user, {
    cascade: true,
  })
  @JoinTable({
    name: 'user_group',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'group_id',
      referencedColumnName: 'id',
    },
  })
  group: GroupEntity[];
}