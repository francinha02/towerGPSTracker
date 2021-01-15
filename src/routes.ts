import { AdapterController } from './controllers/AdapterController'
import { UserController } from './controllers/UserController'

export const Routes = [
  { method: 'get', route: '/users', controller: UserController, action: 'listAll' },
  { method: 'get', route: '/users/:id', controller: UserController, action: 'oneById' },
  { method: 'post', route: '/users/create', controller: UserController, action: 'createUser' },
  { method: 'post', route: '/users/auth', controller: UserController, action: 'auth' },
  { method: 'delete', route: '/users/:id', controller: UserController, action: 'remove' },

  { method: 'get', route: '/adapters', controller: AdapterController, action: 'listAll' },
  { method: 'get', route: '/adapters/:id', controller: AdapterController, action: 'oneById' },
  { method: 'post', route: '/adapters/create', controller: AdapterController, action: 'createAdapter' },
  { method: 'delete', route: '/adapters/:id', controller: AdapterController, action: 'remove' }
]
