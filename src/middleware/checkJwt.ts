import { NextFunction, Request, Response } from 'express'
import { sign, SignOptions, verify, VerifyOptions } from 'jsonwebtoken'
import { getRepository, Repository } from 'typeorm'

import config from '../config/config'
import { User } from '../database/entity/User'
import { UserAuth } from '../models/user'

export default async (req: Request, res: Response, next: NextFunction) => {
  const token =
    req.body.token || req.query.token || req.headers['x-access-token']

  const _userRepository: Repository<User> = getRepository(User)

  if (token) {
    try {
      // SIGNING OPTIONS
      const signOptions: SignOptions = {
        issuer: 'APV Brasil',
        algorithm: 'RS256',
        expiresIn: '1h'
      }

      // VERIFYING OPTIONS
      const verifyOptions: VerifyOptions = {
        issuer: 'APV Brasil',
        algorithms: ['RS256']
      }

      const _userAuth: UserAuth = Object(
        verify(token, config.publicKey, verifyOptions)
      )
      req.userAuth = _userAuth
      const _userDB = await _userRepository.findOne({
        where: {
          id: _userAuth.id
        }
      })
      req.role = _userDB.role

      const { username, name, tm, id } = _userAuth
      const newToken = sign(
        { username, name, tm, id },
        config.privateKey,
        signOptions
      )
      res.setHeader('token', newToken)

      // Call the next middleware or controller
      next()
    } catch (errors) {
      res.status(401).send({ message: 'Token informado é invalido' })
    }
  } else {
    return res.status(401).send({
      message: 'Para acessar esse recurso você precisa estar autenticado.'
    })
  }
}
