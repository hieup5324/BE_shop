import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { GroupEntity } from 'src/modules/group/group.entity';

@Entity('user_group')
export class UserGroupEntity {
  @PrimaryColumn({ name: 'user_id' })
  userId: number;

  @PrimaryColumn({ name: 'group_id' })
  groupId: number;

  @ManyToOne(() => UserEntity, (user) => user.group)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: UserEntity[];

  @ManyToOne(() => GroupEntity, (group) => group.user)
  @JoinColumn([{ name: 'group_id', referencedColumnName: 'id' }])
  group: GroupEntity[];
}
