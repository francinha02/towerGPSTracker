import { DateTime } from 'luxon'
import { filter } from 'mcc-mnc-list'
import { Alarm, Control, Course, Format, GPS, Parts } from '../models/gt06'
import * as f from '../functions/functions'
import Device from '../device'
import crc16 from '../functions/crc16'

const protocol = 'GT06'
const modelName = 'GT06'
const compatibleHardware = ['GT06/supplier']

class Adapter {
  private format: Format
  private device: Device
  private __count

  constructor (device: Device) {
    this.format = { start: '(', end: ')', separator: '' }
    this.device = device
    this.__count = 1
  }

  parseData (data: string | Parts | Buffer) {
    data = f.bufferToHexString(data)

    const parts: Parts = {
      start: data.substr(0, 4),
      action: '',
      cmd: '',
      count: '',
      data: '',
      deviceID: '',
      finish: '',
      gsm: 0,
      length: 0,
      power: 0,
      protocolID: ''
    }

    if (parts.start === '7878') {
      parts.length = parseInt(data.substr(4, 2), 16)
      parts.protocolID = data.substr(6, 2)
      parts.finish = data.substr(6 + parts.length * 2, 4)

      if (parts.finish !== '0d0a') {
        console.error('Finish code incorrect')
      }
      if (parts.protocolID === '01') { // Login Message
        parts.deviceID = data.substr(8, 16)
        parts.cmd = Control.loginRequest
        parts.action = Control.loginRequest
      } else if (parts.protocolID === '12') { // Location Data
        parts.data = data.substr(8, parts.length * 2 + 2)
        parts.cmd = Control.ping
        parts.action = Control.ping
      } else if (parts.protocolID === '13') { // Status information
        parts.data = data.substr(8, parts.length * 2 + 2)
        parts.cmd = Control.heartbeat
        parts.action = Control.heartbeat
      } else if (parts.protocolID === '16' || parts.protocolID === '18') { // Alarm data
        parts.data = data.substr(8, parts.length * 2 + 2)
        parts.cmd = Control.alert
        parts.action = Control.alert
      } else {
        parts.cmd = Control.noop
        parts.action = Control.noop
      }
    }

    return parts
  }

  authorize (protocol: string) {
    const length = '05'
    const protocolID = protocol
    const serial = f.strPad(this.__count, 4, '0')

    const str = length + protocolID + serial

    this.__count++

    const errorCheck = f.strPad(crc16(str).toString(16), 4, '0')
    const buffer: Buffer = Buffer.from('7878' + str + errorCheck + '0d0a', 'hex')

    return buffer
  }

  synchronousClock () {
    const date = new Date()

    const str = (date.getFullYear().toString().substr(2, 2)) +
      (f.zeroPad(date.getMonth() + 1, 2).toString()) +
      (f.zeroPad(date.getDate(), 2).toString()) +
      (f.zeroPad(date.getHours(), 2).toString()) +
      (f.zeroPad(date.getMinutes(), 2).toString()) +
      (f.zeroPad(date.getSeconds(), 2).toString()) +
      (f.zeroPad(this.__count, 4).toString())

    this.__count++

    const errorCheck = f.strPad(crc16(str).toString(16), 4, '0')
    const buffer = Buffer.from('7878' + str + errorCheck + '0d0a', 'hex')
    this.sendCommand(buffer)
  }

  runOther (cmd: string, msgParts) {
    // switch (cmd) {
    //   case 'BP00':
    //     this.device.send(this.formatData(this.device.getUID() + 'AP01HSO'))
    //     break
    // }
  }

  requestLoginToDevice () {
    // TODO: Implement this
  }

  receiveAlarm (msgParts: Parts) {
    const str = msgParts.data

    const data: Alarm = {
      dateTime: this.parseDateTime(str, 'America/Sao_Paulo'),
      setCount: str.substr(12, 2), // Length of GPS information, quantity of positioning satellites
      latitudeRaw: str.substr(14, 8),
      longitudeRaw: str.substr(22, 8),
      latitude: f.dexToDegrees(str.substr(14, 8)),
      longitude: f.dexToDegrees(str.substr(22, 8)),
      speed: parseInt(str.substr(30, 2), 16),
      orientation: this.getCourseStatus(f.strPad(parseInt(str.substr(32, 4), 16).toString(2), 8, '0')),
      lbs: str.substr(36, 18),
      deviceInfo: this.getDeviceInfo(f.strPad(parseInt(str.substr(54, 2), 16).toString(2), 8, '0')),
      power: this.getVoltageInfo(str.substr(56, 2)),
      gsm: this.getGSMInfo(str.substr(58, 2)),
      alarmLang: this.getAlarmLanguage(str.substr(60, 2), str.substr(62, 2))
    }

    return data
  }

  getAlarmLanguage (formerBit: string, latterBit: string) {
    const data = {
      formerBit: '',
      latterBit: ''
    }
    switch (formerBit) {
      case '00':
        data.formerBit = 'Normal'
        break
      case '01':
        data.formerBit = 'SOS'
        break
      case '02':
        data.formerBit = 'Power Cut'
        break
      case '03':
        data.formerBit = 'Shock'
        break
      case '04':
        data.formerBit = 'Fence In'
        break
      case '05':
        data.formerBit = 'Fence Out'
        break
    }

    switch (latterBit) {
      case '01':
        data.latterBit = 'Chinese'
        break
      case '02':
        data.latterBit = 'English'
        break
    }

    return data
  }

  getDeviceInfo (info: string) {
    /**
     * Gets the binary string number and parse data to define status information of the mobile phone
     * @param info The binary value of status information. The index of the first character in the string is zero.
     */
    const data = {
      connected: info.substr(0, 1),
      gpsTracking: info.substr(1, 1),
      alarm: info.substr(2, 3),
      charge: info.substr(5, 1),
      acc: info.substr(6, 1),
      activated: info.substr(7, 1)
    }

    switch (data.alarm) {
      case '100':
        data.alarm = 'SOS'
        break
      case '011':
        data.alarm = 'Low Battery'
        break
      case '010':
        data.alarm = 'Power Cut'
        break
      case '001':
        data.alarm = 'Shock'
        break
      case '000':
        data.alarm = 'Normal'
        break
    }

    return data
  }

  getVoltageInfo (power: string) {
    switch (power) {
      case '00':
        power = 'No Power (shutdown)'
        break
      case '01':
        power = 'Extremely Low Battery'
        break
      case '02':
        power = 'Very Low Battery'
        break
      case '03':
        power = 'Low Battery'
        break
      case '04':
        power = 'Medium'
        break
      case '05':
        power = 'High'
        break
      case '06':
        power = 'Very High'
        break
    }

    return power
  }

  getGSMInfo (gsm: string) {
    switch (gsm) {
      case '00':
        gsm = 'No Signal'
        break
      case '01':
        gsm = 'Extremely Weak Signal'
        break
      case '02':
        gsm = 'Very Weak Signal'
        break
      case '03':
        gsm = 'Good Signal'
        break
      case '04':
        gsm = 'Strong Signal'
        break
    }
    return gsm
  }

  getPingData (msgParts: Parts) {
    const str: string = msgParts.data

    const data: GPS = {
      dateTime: this.parseDateTime(str, 'America/Sao_Paulo'),
      gpsInformation: str.substr(12, 2),
      latitude: f.dexToDegrees(str.substr(14, 8)),
      longitude: f.dexToDegrees(str.substr(22, 8)),
      speed: parseInt(str.substr(30, 2), 16),
      courseStatus: this.getCourseStatus(parseInt(str.substr(32, 4), 16).toString(2)),
      mcc: parseInt(str.substr(36, 4), 16).toString(),
      mnc: f.strPad(parseInt(str.substr(40, 2), 16).toString(), 2, '0'),
      network: filter({ mcc: `${parseInt(str.substr(36, 4), 16)}`, mnc: `${f.strPad(parseInt(str.substr(40, 2), 16).toString(), 2, '0')}` })[0].brand,
      lac: str.substr(42, 4),
      cellID: str.substr(46, 6)
    }

    if (data.courseStatus.latitudePosition === Course.South) {
      data.latitude = data.latitude * (-1)
    }
    if (data.courseStatus.longitudePosition === Course.West) {
      data.longitude = data.longitude * (-1)
    }

    return data
  }

  getCourseStatus (courseStatus: string) {
    const result = {
      realTime: parseInt(courseStatus.substr(2, 1)),
      positioned: parseInt(courseStatus.substr(3, 1)),
      longitudePosition: parseInt(courseStatus.substr(4, 1)),
      latitudePosition: parseInt(courseStatus.substr(5, 1)),
      course: parseInt(courseStatus.substr(6, 10), 2)
    }
    return result
  }

  parseDateTime (data: string, locale?: string) {
    const str: string = data

    const year = parseInt(str.substr(0, 2), 16) + 2000
    const month = f.strPad((parseInt(str.substr(2, 2), 16)).toString(), 2, '0')
    const day = f.strPad(parseInt(str.substr(4, 2), 16).toString(), 2, '0')
    const hour = f.strPad(parseInt(str.substr(6, 2), 16).toString(), 2, '0')
    const minutes = f.strPad(parseInt(str.substr(8, 2), 16).toString(), 2, '0')
    const seconds = f.strPad(parseInt(str.substr(10, 2), 16).toString(), 2, '0')

    let d: DateTime = DateTime.fromISO(`${year}-${month}-${day}T${hour}:${minutes}:${seconds}`, { zone: 'Asia/Shanghai' })
    if (locale) {
      d = d.setZone(locale)
    }

    return d.toString()
  }

  receiveHeartbeat (msgParts: Parts) {
    const str = msgParts.data

    const data = {
      deviceInfo: this.getDeviceInfo(f.strPad(parseInt(str.substr(0, 2), 16).toString(2), 8, '0')),
      power: this.getVoltageInfo(str.substr(2, 2)),
      gsm: this.getGSMInfo(str.substr(4, 2)),
      alarmLang: this.getAlarmLanguage(str.substr(6, 2), str.substr(8, 2))
    }

    return data
  }

  setRefreshTime (interval, duration) { }

  /* INTERNAL FUNCTIONS */
  sendCommand (data: Buffer) {
    this.device.send(data)
  }

  formatData (params: string | (string | Buffer)[]) {
    let str = this.format.start
    if (typeof (params) === 'string') {
      str += params
    } else if (params instanceof Array) {
      str += params.join(this.format.separator)
    } else {
      console.error('The parameters to send to the device has to be a string or an array')
    }
    str += this.format.end
    return str
  }
}

export { protocol, modelName, compatibleHardware, Adapter }
