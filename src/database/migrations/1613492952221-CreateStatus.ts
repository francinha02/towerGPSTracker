import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateStatus1613492952221 implements MigrationInterface {
    name = 'CreateStatus1613492952221'

    public async up (queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('CREATE TABLE `status` (`id` varchar(36) NOT NULL, `active` tinyint NOT NULL DEFAULT 1, `deleted` tinyint NOT NULL DEFAULT 0, `createAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updateAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `blocked` tinyint NOT NULL, `valid` tinyint NOT NULL, `charge` tinyint NOT NULL, `ignition` tinyint NOT NULL, `battery` float(5,2) NOT NULL, `adapterId` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB')
      await queryRunner.query('ALTER TABLE `status` ADD CONSTRAINT `FK_95b18f01abf3de7d708a8d1c7f3` FOREIGN KEY (`adapterId`) REFERENCES `adapter`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION')
    }

    public async down (queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('ALTER TABLE `status` DROP FOREIGN KEY `FK_95b18f01abf3de7d708a8d1c7f3`')
      await queryRunner.query('DROP TABLE `status`')
    }
}
