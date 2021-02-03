import { Router } from 'express'

import { UserController } from '../controllers/UserController'
import checkJwt from '../middleware/checkJwt'
import checkRole from '../middleware/checkRole'
import { BaseRoute } from './BaseRoute'

const base = new BaseRoute<UserController>()

base.route('get', '/users', UserController, 'listAll', [checkJwt, checkRole(['ADMIN'])])
base.route('get', '/users/:id', UserController, 'oneById', [checkJwt, checkRole(['ADMIN'])])
base.route('post', '/users/create', UserController, 'createUser', [checkJwt, checkRole(['ADMIN'])])
base.route('post', '/users/auth', UserController, 'auth')
base.route('post', '/users/change-password', UserController, 'changePassword', [checkJwt])
base.route('delete', '/users/:id', UserController, 'remove', [checkJwt, checkRole(['ADMIN'])])

const route: Router = base.getRouter()
export default route
