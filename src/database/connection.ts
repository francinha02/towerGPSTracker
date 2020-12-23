import { createConnection } from 'typeorm'

const config = require('../../ormconfig.json')

export default {
  createConnection: async () => {
    await createConnection(
      {
        type: config.type,
        host: config.host,
        port: config.port,
        username: config.username,
        password: config.password,
        database: config.database,
        synchronize: false,
        logging: false,
        entities: []
      }
    )
  }
}
