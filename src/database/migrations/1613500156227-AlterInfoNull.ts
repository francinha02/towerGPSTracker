import { MigrationInterface, QueryRunner } from 'typeorm'

export class AlterInfoNull1613500156227 implements MigrationInterface {
    name = 'AlterInfoNull1613500156227'

    public async up (queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('DROP INDEX `IDX_3b8321b0dc9a9cb2e81bfb52cc` ON `location`')
      await queryRunner.query('ALTER TABLE `info` CHANGE `odometer` `odometer` int UNSIGNED NULL')
      await queryRunner.query('ALTER TABLE `info` CHANGE `power` `power` float(5,2) NULL')
      await queryRunner.query('ALTER TABLE `info` CHANGE `serial` `serial` smallint UNSIGNED NULL')
      await queryRunner.query('ALTER TABLE `info` CHANGE `io` `io` smallint UNSIGNED NULL')
      await queryRunner.query('ALTER TABLE `info` CHANGE `mode` `mode` smallint UNSIGNED NULL')
      await queryRunner.query('ALTER TABLE `info` CHANGE `hourMeter` `hourMeter` int UNSIGNED NULL')
      await queryRunner.query('ALTER TABLE `info` CHANGE `archive` `archive` tinyint NULL')
    }

    public async down (queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('ALTER TABLE `info` CHANGE `archive` `archive` tinyint NOT NULL')
      await queryRunner.query('ALTER TABLE `info` CHANGE `hourMeter` `hourMeter` int UNSIGNED NOT NULL')
      await queryRunner.query('ALTER TABLE `info` CHANGE `mode` `mode` smallint UNSIGNED NOT NULL')
      await queryRunner.query('ALTER TABLE `info` CHANGE `io` `io` smallint UNSIGNED NOT NULL')
      await queryRunner.query('ALTER TABLE `info` CHANGE `serial` `serial` smallint UNSIGNED NOT NULL')
      await queryRunner.query('ALTER TABLE `info` CHANGE `power` `power` float(5,2) NOT NULL')
      await queryRunner.query('ALTER TABLE `info` CHANGE `odometer` `odometer` int UNSIGNED NOT NULL')
      await queryRunner.query('CREATE UNIQUE INDEX `IDX_3b8321b0dc9a9cb2e81bfb52cc` ON `location` (`address`)')
    }
}
