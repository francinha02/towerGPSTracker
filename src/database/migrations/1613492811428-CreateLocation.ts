import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateLocation1613492811428 implements MigrationInterface {
    name = 'CreateLocation1613492811428'

    public async up (queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('CREATE TABLE `location` (`id` varchar(36) NOT NULL, `active` tinyint NOT NULL DEFAULT 1, `deleted` tinyint NOT NULL DEFAULT 0, `createAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updateAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `serverTime` timestamp NOT NULL, `fixTime` timestamp NOT NULL, `satellite` smallint UNSIGNED NOT NULL, `latitude` float(12,10) NOT NULL, `longitude` float(12,10) NOT NULL, `speed` smallint UNSIGNED NOT NULL, `course` varchar(10) NOT NULL, `cellId` varchar(10) NOT NULL, `adapterId` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB')
      await queryRunner.query('ALTER TABLE `location` ADD CONSTRAINT `FK_d605880251ccc50b4eab70d649a` FOREIGN KEY (`adapterId`) REFERENCES `adapter`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION')
    }

    public async down (queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('ALTER TABLE `location` DROP FOREIGN KEY `FK_d605880251ccc50b4eab70d649a`')
      await queryRunner.query('DROP TABLE `location`')
    }
}
