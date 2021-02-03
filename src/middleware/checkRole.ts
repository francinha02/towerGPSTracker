import { Request, Response, NextFunction } from 'express'
import { getRepository, Repository } from 'typeorm'

import { User } from '../database/entity/User'

export default (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Get the user ID from previous middleware
    const id = req.userAuth.id
    const _userRepository: Repository<User> = getRepository(User)

    try {
      const user: User = await _userRepository.findOneOrFail(id)

      roles.indexOf(user.role) > -1
        ? next()
        : res.status(401).send({ message: '' })
    } catch (errors) {
      res.status(401).send({ message: 'Não autorizado!' })
    }
  }
}
