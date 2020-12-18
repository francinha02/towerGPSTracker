import net from 'net'
import { Control } from './lib/models/gt06'
import { Options } from './lib/models/server'
import Server from './lib/server'
import * as f from './lib/functions/functions'

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
})

serverGT06.setDebug(true)

const clientServer = net.createServer(socket => {
  const parts = {
    start: '',
    cmd: null,
    deviceID: null
  }

  socket.on('data', data => {
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
    serverGT06.sendTo(parts.deviceID, Buffer.from(parts.cmd), true)
  })
})

clientServer.listen(2791, process.env.HOST)
