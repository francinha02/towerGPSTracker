import 'reflect-metadata'

import * as bodyParser from 'body-parser'
import cors from 'cors'
import express, { Request, Response } from 'express'
import helmet from 'helmet'
import net from 'net'

import config from './config/config'
import connection from './database/connection'
import { Control } from './lib/models/gt06'
import { Options } from './lib/models/server'
import Server from './lib/server'
import auth from './middleware/auth'
import { Routes } from './routes'

// create express app
const app = express()

// Call middleware
app.use(cors())
app.use(helmet())
app.use(bodyParser.json())
app.use(auth)

// register express routes from defined application routes
Routes.forEach((route) => {
  (app as any)[route.method](
    route.route,
    // eslint-disable-next-line @typescript-eslint/ban-types
    (req: Request, res: Response, next: Function) => {
      const result = new (route.controller as any)()[route.action](
        req,
        res,
        next
      )
      if (result instanceof Promise) {
        result.then((result) => {
          result && result.status
            ? res
                .status(
                  result.status >= 100 && result.status < 600
                    ? result.status
                    : 500
                )
                .json(result.message || result.errors)
            : res.json(result)
        })
      } else if (result !== null && result !== undefined) {
        res.json(result)
      }
    }
  )
})

app.listen(config.webPort, '0.0.0.0', async () => {
  console.log(`API initialized on port ${config.webPort}`)
  try {
    await connection.createConnection()
    console.log('Database connected')
  } catch (error) {
    console.error('Database not connected', error)
  }
})

const options: Options = {
  debug: true,
  deviceAdapter: 'GT02D',
  port: 2790
}

const serverGT06 = new Server(options, (device) => {
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

serverGT06.setDebug(true)

const clientServer = net.createServer((socket) => {
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
      serverGT06.sendTo(parts.deviceID, Buffer.from(parts.cmd), true)
    } catch (e) {
      console.log(e)
    }
  })
})

clientServer.listen(2791, process.env.HOST)
