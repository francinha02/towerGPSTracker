import { Control, LanguagePack, Parts, TerminalInformation } from './lib/models/gt06'
import { Options } from './lib/models/server'
import Server from './lib/server'

const options: Options = {
  debug: true,
  deviceAdapter: 'GT02D',
  port: 2790
}

const serverGT06 = new Server(options, (device, connection) => {
  device.on(Control.loginRequest, (deviceID, msgParts) => {
    device.loginAuthorized(true, msgParts)
  })

  device.on(Control.ping, (gpsData, msgParts) => {
    console.log(gpsData)
  })

  device.on(Control.alert, (deviceInfo: TerminalInformation, power: string, gsm: string, language: LanguagePack, msgParts: Parts) => {
    console.log(deviceInfo, power, gsm, language, msgParts)
    device.responseAlarm(true)
  })
})

serverGT06.setDebug(true)
