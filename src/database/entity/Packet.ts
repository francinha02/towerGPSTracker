import { Entity, Column, ManyToOne } from 'typeorm'

import { Adapter } from './Adapter'
import { BaseEntity } from './BaseEntity'

@Entity()
export class Packet extends BaseEntity {
  @Column({ type: 'timestamp' })
  serverTime: Date;

  @Column({ type: 'timestamp' })
  fixTime: Date;

  @Column({ type: 'bigint', unsigned: true })
  deviceId: number;

  @Column({ type: 'boolean' })
  ignition: boolean;

  @Column({ type: 'boolean' })
  gps: boolean;

  @Column({ type: 'smallint', unsigned: true })
  sat: number;

  @Column({ type: 'boolean' })
  valid: boolean;

  @Column({ type: 'boolean' })
  blocked: boolean;

  @Column({ type: 'smallint', unsigned: true })
  speed: number;

  @Column({ type: 'int', unsigned: true })
  odometer: number;

  @Column({ type: 'float', precision: 5, scale: 2 })
  power: number;

  @Column({ type: 'float', precision: 5, scale: 2 })
  battery: string;

  @Column({ type: 'tinyint', unsigned: true })
  batteryLevel: number;

  @Column({ type: 'smallint', unsigned: true })
  serial: number;

  @Column({ type: 'float', precision: 12, scale: 10 })
  latitude: number;

  @Column({ type: 'float', precision: 12, scale: 10 })
  longitude: number;

  @ManyToOne(() => Adapter, (adapter: Adapter) => adapter.packetId)
  adapter: Adapter
}
