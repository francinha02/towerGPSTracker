/* eslint-disable @typescript-eslint/no-unused-vars */

import bcrypt from 'bcrypt'
import { getRepository, MigrationInterface, QueryRunner } from 'typeorm'

import { User } from '../entity/User'

export class CreateAdminUser1612380018100 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    const user = new User()
    user.username = 'admin'
    user.name = 'Administrator'
    user.password = await bcrypt.hash('@Lab2019', 10)
    user.role = 'ADMIN'
    user.active = true
    user.deleted = false
    user.createAt = new Date()
    user.updateAt = new Date()
    user.id = 'dbf8b79c-6656-11eb-ae93-0242ac130002'

    const _userRepository = getRepository(User)
    await _userRepository.save(user)
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async down (queryRunner: QueryRunner): Promise<void> {}
}
