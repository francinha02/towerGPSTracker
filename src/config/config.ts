import * as dotenv from 'dotenv'

dotenv.config()

export default {
  port: process.env.PORT || 2790,
  host: process.env.HOST || '127.0.0.1'
}
