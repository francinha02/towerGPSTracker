import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateUser1608732219014 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [{
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
          name: 'name',
          type: 'varchar'
        },
        {
          name: 'username',
          type: 'varchar'
        },
        {
          name: 'isRoot',
          type: 'boolean',
          default: false
        },
        {
          name: 'password',
          type: 'varchar'
        }]
      })
    )
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user')
  }
}
