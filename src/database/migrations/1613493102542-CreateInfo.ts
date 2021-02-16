import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateInfo1613493102542 implements MigrationInterface {
    name = 'CreateInfo1613493102542'

    public async up (queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('CREATE TABLE `info` (`id` varchar(36) NOT NULL, `active` tinyint NOT NULL DEFAULT 1, `deleted` tinyint NOT NULL DEFAULT 0, `createAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updateAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `odometer` int UNSIGNED NOT NULL, `power` float(5,2) NOT NULL, `serial` smallint UNSIGNED NOT NULL, `io` smallint UNSIGNED NOT NULL, `mode` smallint UNSIGNED NOT NULL, `hourMeter` int UNSIGNED NOT NULL, `archive` tinyint NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB')
      await queryRunner.query('ALTER TABLE `status` ADD `info` varchar(36) NULL')
      await queryRunner.query('ALTER TABLE `status` ADD UNIQUE INDEX `IDX_a2688b29bc9b109396d0396334` (`info`)')
      await queryRunner.query('CREATE UNIQUE INDEX `REL_a2688b29bc9b109396d0396334` ON `status` (`info`)')
      await queryRunner.query('ALTER TABLE `status` ADD CONSTRAINT `FK_a2688b29bc9b109396d0396334f` FOREIGN KEY (`info`) REFERENCES `info`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION')
    }

    public async down (queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('ALTER TABLE `status` DROP FOREIGN KEY `FK_a2688b29bc9b109396d0396334f`')
      await queryRunner.query('DROP INDEX `REL_a2688b29bc9b109396d0396334` ON `status`')
      await queryRunner.query('ALTER TABLE `status` DROP INDEX `IDX_a2688b29bc9b109396d0396334`')
      await queryRunner.query('ALTER TABLE `status` DROP COLUMN `info`')
      await queryRunner.query('DROP TABLE `info`')
    }
}
