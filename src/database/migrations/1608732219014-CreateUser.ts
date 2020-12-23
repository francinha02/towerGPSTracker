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
          name: 'create_at',
          type: 'timestamp',
          default: 'now()'
        },
        {
          name: 'update_at',
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
          name: 'is_root',
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
