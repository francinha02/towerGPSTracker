import { createConnection } from 'typeorm'

import { Adapter } from './entity/Adapter'
import { User } from './entity/User'

const config = require('../../ormconfig.json')

export default {
  createConnection: async () => {
    await createConnection({
      type: config.type,
      host: config.host,
      port: config.webPort,
      username: config.username,
      password: config.password,
      database: config.database,
      synchronize: false,
      logging: false,
      entities: [User, Adapter]
    })
  }
}
