import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateAddress1613493850880 implements MigrationInterface {
    name = 'CreateAddress1613493850880'

    public async up (queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('DROP INDEX `IDX_a2688b29bc9b109396d0396334` ON `status`')
      await queryRunner.query('CREATE TABLE `address` (`id` varchar(36) NOT NULL, `active` tinyint NOT NULL DEFAULT 1, `deleted` tinyint NOT NULL DEFAULT 0, `createAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updateAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `road` varchar(100) NOT NULL, `suburb` varchar(50) NOT NULL, `city` varchar(30) NOT NULL, `state` varchar(30) NOT NULL, `region` varchar(50) NOT NULL, `postcode` varchar(9) NOT NULL, `country` varchar(20) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB')
      await queryRunner.query('ALTER TABLE `location` ADD `address` varchar(36) NULL')
      await queryRunner.query('ALTER TABLE `location` ADD UNIQUE INDEX `IDX_3b8321b0dc9a9cb2e81bfb52cc` (`address`)')
      await queryRunner.query('CREATE UNIQUE INDEX `REL_3b8321b0dc9a9cb2e81bfb52cc` ON `location` (`address`)')
      await queryRunner.query('ALTER TABLE `location` ADD CONSTRAINT `FK_3b8321b0dc9a9cb2e81bfb52cc0` FOREIGN KEY (`address`) REFERENCES `address`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION')
    }

    public async down (queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('ALTER TABLE `location` DROP FOREIGN KEY `FK_3b8321b0dc9a9cb2e81bfb52cc0`')
      await queryRunner.query('DROP INDEX `REL_3b8321b0dc9a9cb2e81bfb52cc` ON `location`')
      await queryRunner.query('ALTER TABLE `location` DROP INDEX `IDX_3b8321b0dc9a9cb2e81bfb52cc`')
      await queryRunner.query('ALTER TABLE `location` DROP COLUMN `address`')
      await queryRunner.query('DROP TABLE `address`')
      await queryRunner.query('CREATE UNIQUE INDEX `IDX_a2688b29bc9b109396d0396334` ON `status` (`info`)')
    }
}
