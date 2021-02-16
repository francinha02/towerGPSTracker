import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateAdapter1613492546637 implements MigrationInterface {
    name = 'CreateAdapter1613492546637'

    public async up (queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query("CREATE TABLE `adapter` (`id` varchar(36) NOT NULL, `active` tinyint NOT NULL DEFAULT 1, `deleted` tinyint NOT NULL DEFAULT 0, `createAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updateAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `code` smallint UNSIGNED NOT NULL, `description` varchar(200) NOT NULL, `model` enum ('SUNTECH', 'GT06') NOT NULL, `equipmentNumber` bigint UNSIGNED NOT NULL, `phone` varchar(25) NOT NULL, `mobileOperator` enum ('Claro', 'Oi', 'Tim', 'Vivo', 'Vodafone', 'Outras') NOT NULL, `chipNumber` varchar(25) NOT NULL, `timezone` enum ('GMT-14', 'GMT-13', 'GMT-12', 'GMT-11', 'GMT-10', 'GMT-9', 'GMT-8', 'GMT-7', 'GMT-6', 'GMT-5', 'GMT-4', 'GMT-3', 'GMT-2', 'GMT-1', 'GMT+1', 'GMT+2', 'GMT+3', 'GMT+4', 'GMT+5', 'GMT+6', 'GMT+7', 'GMT+8', 'GMT+9', 'GMT+10', 'GMT+11', 'GMT+12') NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB")
    }

    public async down (queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('DROP TABLE `adapter`')
    }
}
