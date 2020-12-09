import net from 'net'
import {
  Control,
  LanguagePack,
  TerminalInformation
} from './lib/models/gt06'
import { Options } from './lib/models/server'
import Server from './lib/server'
import * as f from './lib/functions/functions'

const options: Options = {
  debug: true,
  deviceAdapter: 'GT02D',
  port: 2790
}

let command: Buffer

const serverGT06 = new Server(options, command, (device) => {
  device.on(Control.loginRequest, (deviceID, msgParts) => {
    device.loginAuthorized(true, msgParts)
  })

  device.on(Control.ping, (gpsData) => {
    console.log(gpsData)
  })

  device.on(
    Control.alert,
    (
      deviceInfo: TerminalInformation,
      power: string,
      gsm: string,
      language: LanguagePack
    ) => {
      console.log(deviceInfo, power, gsm, language)
      device.responsePacket(true, '16')
    }
  )

  device.on(Control.heartbeat, heart => {
    console.log(heart)
    device.responsePacket(true, '13')
  })
})

serverGT06.setDebug(true)

const clientServer = net.createServer(socket => {
  const parts = {
    start: '',
    cmd: '',
    deviceID: ''
  }
  socket.on('data', data => {
    const str = f.bufferToHexString(data)
    parts.start = str.substr(0, 2)

    if (parts.start === '54') {
      parts.cmd = str.substr(2, 22)
      parts.deviceID = str.substring(24)
    } else if (parts.start === '46') {
      parts.cmd = str.substr(2, 22)
      parts.deviceID = str.substring(26)
    } else {
      parts.cmd = 'noop'
      parts.deviceID = 'noop'
    }
    console.log(parts.start, parts.cmd, parts.deviceID)
    serverGT06.sendTo(parts.deviceID, Buffer.from(parts.cmd), true)
  })
})

clientServer.listen(2791, process.env.HOST)
