import { Request, Response } from 'express'
import { sign, SignOptions, verify, VerifyOptions } from 'jsonwebtoken'
import { getRepository, Repository } from 'typeorm'

import config from '../config/config'
import { User } from '../database/entity/User'

interface UserAuth {
  id: string;
  name: string;
  username: string;
  tm: Date;
  iat: Date;
}

export default async (req: Request, res: Response, next) => {
  const token =
    req.body.token || req.query.token || req.headers['x-access-token']

  const publicRoutes = <Array<string>>config.publicRouters
  let isPublicRoute = false
  const _userRepository: Repository<User> = getRepository(User)

  publicRoutes.forEach((url) => {
    const isPublic = req.url.includes(url)
    if (isPublic) isPublicRoute = true
  })

  if (isPublicRoute) next()
  else if (token) {
    try {
      // PRIVATE and PUBLIC key
      const _privateKey = config.privateKey
      const _publicKey = config.publicKey

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

      const _userAuth: UserAuth = Object(verify(token, _publicKey, verifyOptions))
      req.userAuth = _userAuth
      const _userDB = await _userRepository.findOne({
        where: {
          id: _userAuth.id
        }
      })
      req.IsRoot = _userDB.isRoot

      const { username, name, tm, id } = _userAuth
      const newToken = sign({ username, name, tm, id }, _privateKey, signOptions)
      res.setHeader('token', newToken)
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
