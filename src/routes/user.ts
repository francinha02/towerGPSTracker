import { Router } from 'express'

import { UserController } from '../controllers/UserController'
import auth from '../middleware/auth'
import { BaseRoute } from './BaseRoute'

const base = new BaseRoute<UserController>()

base.route('get', '/users', UserController, 'listAll', [auth])
base.route('get', '/users/:id', UserController, 'oneById')
base.route('post', '/users/create', UserController, 'createUser')
base.route('post', '/users/auth', UserController, 'auth')
base.route('delete', '/users/:id', UserController, 'remove')

const route: Router = base.getRouter()
export default route
