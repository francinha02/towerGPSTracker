import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateAdapter1610652664570 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'adapter',
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
            name: 'code',
            type: 'smallint',
            unsigned: true
          },
          {
            name: 'description',
            type: 'varchar',
            length: '200'
          },
          {
            name: 'model',
            enum: ['SUNTECH', 'GT06'],
            type: 'enum'
          },
          {
            name: 'equipmentNumber',
            type: 'bigint',
            unsigned: true
          },
          {
            name: 'phone',
            type: 'varchar',
            length: '25'
          },
          {
            name: 'mobileOperator',
            type: 'enum',
            enum: ['Claro', 'Oi', 'Tim', 'Vivo', 'Vodafone', 'Outras']
          },
          {
            name: 'chipNumber',
            type: 'varchar',
            length: '25'
          },
          {
            name: 'timezone',
            type: 'enum',
            enum: [
              'GMT-14',
              'GMT-13',
              'GMT-12',
              'GMT-11',
              'GMT-10',
              'GMT-9',
              'GMT-8',
              'GMT-7',
              'GMT-6',
              'GMT-5',
              'GMT-4',
              'GMT-3',
              'GMT-2',
              'GMT-1',
              'GMT+1',
              'GMT+2',
              'GMT+3',
              'GMT+4',
              'GMT+5',
              'GMT+6',
              'GMT+7',
              'GMT+8',
              'GMT+9',
              'GMT+10',
              'GMT+11',
              'GMT+12'
            ]
          }
        ]
      })
    )
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('adapter')
  }
}
