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

  async auth (request: Request) {
    const { username, password } = request.body

    if (!username || !password) {
      return {
        status: 400,
        errors: ['Informe o nome de usuário e a senha para efetuar o login']
      }
    }

    // Get user from database
    const user = await this.repository.findOne({ username })
    // Check if encrypted password match
    if (user) {
      if (!(await UserController.checkUnencryptedPassword(password, user.password))) {
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

      // Sing JWT, valid for 1 hour
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

  async changePassword (request: Request) {
    // Get ID from JWT
    const id = request.userAuth.id

    // Get parameters from the body
    const { oldPassword, newPassword } = request.body
    if (!(oldPassword && newPassword)) {
      return {
        status: 400,
        errors: ['Informe a senha antiga e a nova senha para efetuar a mudança']
      }
    }

    // Get user from the database
    const user = await this.repository.findOne({ id })

    if (!UserController.checkUnencryptedPassword(oldPassword, user.password)) {
      return {
        status: 401,
        errors: ['Nome de usuário e/ou senha inválidos']
      }
    }

    user.password = await bcrypt.hash(newPassword, 10)
    return super.save(user)
  }

  async createUser (request: Request) {
    const { name, username, role, password, confirmPassword } = request.body
    super.isRequired(name, 'Informe o nome')
    super.isRequired(username, 'Informe o nome de usuário')
    super.isRequired(password, 'Informe a senha')
    super.isRequired(confirmPassword, 'Informe a confirmação da senha')

    const _user = new User()
    _user.name = name
    _user.username = username
    _user.role = role
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

    return super.save(_user)
  }

  async listAll () {
    const selector = ['id', 'name', 'username', 'role']
    const users = await this.all(selector)
    return users
  }

  async oneById (request: Request) {
    const selector = ['id', 'name', 'username', 'role']
    const user = await this.one(request, selector)
    return user
  }

  private static async checkUnencryptedPassword (unencryptedPassword: string, password: string): Promise<boolean> {
    return await bcrypt.compare(unencryptedPassword, password)
  }
}
