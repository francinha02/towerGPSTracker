import 'reflect-metadata'

import * as bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { createServer } from 'net'

import config from './config/config'
import connection from './database/connection'
import { Control } from './lib/models/gt06'
import { Options } from './lib/models/server'
import Server from './lib/server'
import routes from './routes'

connection
  .createConnection()
  .then(async () => {
    console.log('Database connected')
    const app = express()
    // Call middleware
    app.use(cors())
    app.use(helmet())
    app.use(bodyParser.json())
    app.use('/', routes)

    app.listen(config.webPort, '0.0.0.0', () => {
      console.log(`API initialized on port ${config.webPort}`)
    })

    const options: Options[] = config.optionsTCP
    let server: Server

    options.forEach((opts) => {
      server = new Server(opts, (device) => {
        device.on(Control.loginRequest, (deviceID, msgParts) => {
          device.loginAuthorized(true, msgParts)
          console.log(deviceID, msgParts)
        })

        device.on(Control.ping, (gpsData) => {
          console.log(gpsData)
        })

        device.on(Control.alert, (alert) => {
          console.log(alert)
          device.responsePacket(true, alert)
        })

        device.on(Control.heartbeat, (heart) => {
          console.log(heart)
          device.responsePacket(true, heart)
        })

        device.on('warning', (e) => {
          console.log(e)
        })
      })

      server.setDebug(true)
    })

    const clientServer = createServer((socket) => {
      const parts = {
        start: '',
        cmd: null,
        deviceID: null
      }

      socket.on('data', (data) => {
        parts.start = data[0].toString(16)

        if (parts.start === '54') {
          parts.cmd = data.slice(1, 12)
          parts.deviceID = parseInt(data.slice(12).toString('hex'), 10)
        } else if (parts.start === '46') {
          parts.cmd = data.slice(1, 13)
          parts.deviceID = parseInt(data.slice(13).toString('hex'), 10)
        } else {
          parts.cmd = 'noop'
          parts.deviceID = 0
        }
        console.log(parts.start, parts.cmd, parts.deviceID)
        try {
          server.sendTo(parts.deviceID, Buffer.from(parts.cmd), true)
        } catch (e) {
          console.log(e)
        }
      })
    })

    clientServer.listen(2792, process.env.HOST)
  })
  .catch((error) => console.error(error))
