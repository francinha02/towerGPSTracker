import { Router } from 'express'

import { AdapterController } from '../controllers/AdapterController'
import checkJwt from '../middleware/checkJwt'
import { BaseRoute } from './BaseRoute'

const base = new BaseRoute<AdapterController>()

base.route('get', '/adapters', AdapterController, 'listAll', [checkJwt])
base.route('get', '/adapters/:id', AdapterController, 'oneById', [checkJwt])
base.route('post', '/adapters/create', AdapterController, 'createUser', [checkJwt])
base.route('delete', '/adapters/:id', AdapterController, 'remove', [checkJwt])

const route: Router = base.getRouter()
export default route
