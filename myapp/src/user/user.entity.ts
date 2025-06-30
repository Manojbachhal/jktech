import { Column, Entity, OneToMany } from 'typeorm';
import { Document } from '../documents/document.entity';
import { Role } from '../auth/enums/role.enum';
import { BaseEntity } from '../common/entities/base.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: Role })
  role: Role;

  @OneToMany(() => Document, (document) => document.owner)
  documents: Document[];
}
