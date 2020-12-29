import 'dotenv/config'

export default {
  port: process.env.PORT || 2790,
  webPort: parseInt(process.env.WEB_PORT) || 3000,
  host: process.env.HOST || '127.0.0.1',
  publicRouters: process.env.PUBLIC_ROUTER || ['users/create', 'users/auth'],
  publicKey: process.env.PUBLIC_KEY,
  privateKey: process.env.PRIVATE_KEY
}
