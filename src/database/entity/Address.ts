import { Entity, Column, OneToOne } from 'typeorm'

import { BaseEntity } from './BaseEntity'
import { Location } from './Location'

@Entity()
export class Address extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  road: string;

  @Column({ type: 'varchar', length: 50 })
  suburb: string;

  @Column({ type: 'varchar', length: 30 })
  city: string;

  @Column({ type: 'varchar', length: 30 })
  state: string;

  @Column({ type: 'varchar', length: 50 })
  region: string;

  @Column({ type: 'varchar', length: 9 })
  postcode: string;

  @Column({ type: 'varchar', length: 20 })
  country: string;

  @OneToOne(() => Location, (location: Location) => location.address)
  location: Location
}
