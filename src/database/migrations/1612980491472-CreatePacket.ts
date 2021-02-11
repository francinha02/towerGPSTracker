import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreatePacket1612980491472 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'packet',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            generationStrategy: 'uuid'
          },
          {
            name: 'active',
            type: 'boolean',
            default: true
          },
          {
            name: 'deleted',
            type: 'boolean',
            default: false
          },
          {
            name: 'createAt',
            type: 'timestamp',
            default: 'now()'
          },
          {
            name: 'updateAt',
            type: 'timestamp',
            default: 'now()'
          },
          {
            name: 'serverTime',
            type: 'timestamp'
          },
          {
            name: 'fixTime',
            type: 'timestamp'
          },
          {
            name: 'deviceId',
            type: 'bigint',
            unsigned: true
          },
          {
            name: 'ignition',
            type: 'boolean'
          },
          {
            name: 'gps',
            type: 'boolean'
          },
          {
            name: 'sat',
            type: 'smallint',
            unsigned: true
          },
          {
            name: 'valid',
            type: 'boolean'
          },
          {
            name: 'blocked',
            type: 'boolean'
          },
          {
            name: 'speed',
            type: 'smallint',
            unsigned: true
          },
          {
            name: 'odometer',
            type: 'smallint',
            unsigned: true
          },
          {
            name: 'power',
            type: 'float',
            precision: 5,
            scale: 2
          },
          {
            name: 'battery',
            type: 'float',
            precision: 5,
            scale: 2
          },
          {
            name: 'batteryLevel',
            type: 'tinyint',
            unsigned: true
          },
          {
            name: 'serial',
            type: 'smallint',
            unsigned: true
          },
          {
            name: 'latitude',
            type: 'float',
            precision: 12,
            scale: 10
          },
          {
            name: 'longitude',
            type: 'float',
            precision: 12,
            scale: 10
          }
        ]
      })
    )
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('packet')
  }
}
