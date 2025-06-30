import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';
import { User } from '../user/user.entity';

@Entity()
export class Document extends BaseEntity {
  @Column()
  title: string;

  @Column()
  filePath: string;

  @ManyToOne(() => User, (user) => user.documents)
  owner: User;
}
