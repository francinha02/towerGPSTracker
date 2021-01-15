import { Entity, Column } from 'typeorm'

import { BaseEntity } from './BaseEntity'
import { MobileOperator, ModelType, TimeZone } from './enum/AdapterTypes'

@Entity()
export class Adapter extends BaseEntity {
  @Column({ type: 'smallint', unsigned: true })
  code: number;

  @Column({ type: 'varchar', length: 200 })
  description: string;

  @Column({ type: 'enum', enum: ModelType })
  model: ModelType;

  @Column({ type: 'bigint', unsigned: true })
  equipmentNumber: number;

  @Column({ type: 'varchar', length: 25 })
  phone: string;

  @Column({ type: 'enum', enum: MobileOperator })
  mobileOperator: MobileOperator;

  @Column({ type: 'varchar', length: 25 })
  chipNumber: string;

  @Column({ type: 'enum', enum: TimeZone })
  timezone: TimeZone;
}
