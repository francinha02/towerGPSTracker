import { Entity, Column, OneToOne } from 'typeorm'

import { BaseEntity } from './BaseEntity'
import { Status } from './Status'

@Entity()
export class Info extends BaseEntity {
  @Column({ type: 'int', unsigned: true, nullable: true })
  odometer: number;

  @Column({ type: 'float', precision: 5, scale: 2, nullable: true })
  power: number;

  @Column({ type: 'smallint', unsigned: true, nullable: true })
  serial: number;

  @Column({ type: 'smallint', unsigned: true, nullable: true })
  io: number;

  @Column({ type: 'smallint', unsigned: true, nullable: true })
  mode: number;

  @Column({ type: 'int', unsigned: true, nullable: true })
  hourMeter: number;

  @Column({ type: 'boolean', nullable: true })
  archive: boolean;

  @OneToOne(() => Status, (status: Status) => status.info)
  status: Status
}
