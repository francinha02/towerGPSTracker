import 'dotenv/config'

export default {
  port: process.env.PORT || 2790,
  webPort: parseInt(process.env.WEB_PORT) || 3000,
  host: process.env.HOST || '127.0.0.1'
}
