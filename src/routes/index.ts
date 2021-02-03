import { Router } from 'express'

import adapter from './adapter'
import user from './user'

const routes = Router()

routes.use('/', user)
routes.use('/', adapter)

export default routes
