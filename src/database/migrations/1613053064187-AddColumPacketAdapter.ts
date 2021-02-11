import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm'

export class AddColumPacketAdapter1613053064187 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'packet',
      new TableColumn({
        name: 'adapterId',
        type: 'varchar',
        length: '36'
      })
    )

    await queryRunner.createForeignKey(
      'packet',
      new TableForeignKey({
        columnNames: ['adapterId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'adapter'
      })
    )
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('packet')
    const foreignKey = table.foreignKeys.find(
      fk => fk.columnNames.indexOf('adapterId') !== -1
    )
    await queryRunner.dropForeignKey('packet', foreignKey)
    await queryRunner.dropIndex('adapter', 'IDX_ADAPTER_PACKET_ID')
    await queryRunner.dropColumn('packet', 'adapterId')
    await queryRunner.dropColumn('adapter', 'packetId')
  }
}
