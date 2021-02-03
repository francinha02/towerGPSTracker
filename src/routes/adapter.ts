import { Router } from 'express'

import { AdapterController } from '../controllers/AdapterController'
import auth from '../middleware/auth'
import { BaseRoute } from './BaseRoute'

const base = new BaseRoute<AdapterController>()

base.route('get', '/adapters', AdapterController, 'listAll', [auth])
base.route('get', '/adapters/:id', AdapterController, 'oneById', [auth])
base.route('post', '/adapters/create', AdapterController, 'createUser', [auth])
base.route('delete', '/adapters/:id', AdapterController, 'remove', [auth])

const route: Router = base.getRouter()
export default route
