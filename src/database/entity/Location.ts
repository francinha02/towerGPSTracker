import { Entity, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm'

import { Adapter } from './Adapter'
import { Address } from './Address'
import { BaseEntity } from './BaseEntity'

@Entity()
export class Location extends BaseEntity {
  @Column({ type: 'timestamp' })
  serverTime: Date;

  @Column({ type: 'timestamp' })
  fixTime: Date;

  @Column({ type: 'smallint', unsigned: true })
  satellite: number;

  @Column({ type: 'float', precision: 12, scale: 10 })
  latitude: number;

  @Column({ type: 'float', precision: 12, scale: 10 })
  longitude: number;

  @Column({ type: 'smallint', unsigned: true })
  speed: number;

  @Column({ type: 'varchar', length: 10 })
  course: string;

  @Column({ type: 'varchar', length: 10 })
  cellId: string;

  @ManyToOne(() => Adapter, (adapter: Adapter) => adapter.location)
  adapter: Adapter

  @OneToOne(() => Address, (address: Address) => address.location)
  @JoinColumn({ name: 'address' })
  address: Address
}
