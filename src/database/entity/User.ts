import { Entity, Column } from 'typeorm'

import { BaseEntity } from './BaseEntity'

@Entity()
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  username: string;

  @Column({ type: 'varchar', length: 50 })
  role: string;

  @Column({ type: 'varchar', length: 100 })
  password: string;
}
