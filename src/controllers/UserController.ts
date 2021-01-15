import bcrypt from 'bcrypt'
import { Request } from 'express'
import { sign, SignOptions } from 'jsonwebtoken'

import config from '../config/config'
import { User } from '../database/entity/User'
import { BaseController } from './BaseController'

export class UserController extends BaseController<User> {
  constructor () {
    super(User)
  }

  async auth (req: Request) {
    const { username, password } = req.body

    if (!username || !password) {
      return {
        status: 400,
        errors: ['Informe o nome de usuário e a senha para efetuar o login']
      }
    }
    const user = await this.repository.findOne({ username })

    if (user) {
      const comparePass = await bcrypt.compare(password, user.password)

      if (!comparePass) {
        return {
          status: 404,
          errors: ['Nome de usuário e/ou senha inválidos']
        }
      }
      // PRIVATE and PUBLIC key
      const _privateKey = config.privateKey
      // PAYLOAD
      const _payload = {
        id: user.id,
        name: user.name,
        username: user.username
      }

      // SIGNING OPTIONS
      const signOptions: SignOptions = {
        issuer: 'APV Brasil',
        algorithm: 'RS256',
        expiresIn: '1h'
      }

      return {
        status: 200,
        message: {
          user: _payload,
          token: sign(
            {
              ..._payload,
              tm: new Date().getTime()
            },
            _privateKey,
            signOptions
          )
        }
      }
    } else {
      return {
        status: 404,
        errors: ['Nome de usuário e/ou senha inválidos']
      }
    }
  }

  async createUser (request: Request) {
    const { name, username, isRoot, password, confirmPassword } = request.body
    super.isRequired(name, 'Informe o nome')
    super.isRequired(username, 'Informe o nome de usuário')
    super.isRequired(password, 'Informe a senha')
    super.isRequired(confirmPassword, 'Informe a confirmação da senha')

    const _user = new User()
    _user.name = name
    _user.username = username
    if (password !== confirmPassword) {
      return {
        status: 400,
        errors: ['As senhas não coincidem']
      }
    }

    const verifyUsername = await this.repository.findOne({ username })

    if (verifyUsername) {
      return {
        status: 400,
        errors: ['Usuário já cadastrado no banco de dados.']
      }
    }

    if (password) _user.password = await bcrypt.hash(password, 10)
    _user.isRoot = isRoot

    return super.save(_user, request)
  }

  async listAll (request: Request) {
    const selector = ['id', 'name', 'username']
    const users = await this.all(request, selector)
    return users
  }

  async oneById (request: Request) {
    const selector = ['id', 'name', 'username']
    const user = await this.one(request, selector)
    return user
  }
}
