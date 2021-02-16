import { Entity, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm'

import { Adapter } from './Adapter'
import { BaseEntity } from './BaseEntity'
import { Info } from './Info'

@Entity()
export class Status extends BaseEntity {
  @Column({ type: 'boolean' })
  blocked: boolean;

  @Column({ type: 'boolean' })
  valid: boolean;

  @Column({ type: 'boolean' })
  charge: boolean;

  @Column({ type: 'boolean' })
  ignition: boolean;

  @Column({ type: 'float', precision: 5, scale: 2 })
  battery: number;

  @ManyToOne(() => Adapter, (adapter: Adapter) => adapter.status)
  adapter: Adapter

  @OneToOne(() => Info, (info: Info) => info.status)
  @JoinColumn({ name: 'info' })
  info: Info
}
