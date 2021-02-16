import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateUser1613492391809 implements MigrationInterface {
    name = 'CreateUser1613492391809'

    public async up (queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('CREATE TABLE `user` (`id` varchar(36) NOT NULL, `active` tinyint NOT NULL DEFAULT 1, `deleted` tinyint NOT NULL DEFAULT 0, `createAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updateAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `name` varchar(100) NOT NULL, `username` varchar(100) NOT NULL, `role` varchar(50) NOT NULL, `password` varchar(100) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB')
    }

    public async down (queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('DROP TABLE `user`')
    }
}
