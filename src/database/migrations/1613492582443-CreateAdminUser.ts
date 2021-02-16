/* eslint-disable @typescript-eslint/no-unused-vars */
import bcrypt from 'bcrypt'
import { getRepository, MigrationInterface, QueryRunner } from 'typeorm'

import { User } from '../entity/User'

export class CreateAdminUser1613492582443 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    const user = new User()
    user.username = 'admin'
    user.name = 'Administrator'
    user.password = await bcrypt.hash('123456', 10)
    user.role = 'ADMIN'

    const _userRepository = getRepository(User)
    await _userRepository.save(user)
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    const _userRepository = getRepository(User)
    const user = await _userRepository.findOne({
      where: { username: 'admin' }
    })
    await _userRepository.delete(user)
  }
}
