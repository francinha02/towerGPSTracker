import {
  Control,
  CourseStatus,
  Event,
  LanguagePack,
  ParseAlarm,
  ParsedMsg,
  ParseLocation,
  ParseLogin,
  ParseStatus,
  TerminalInformation
} from '../models/gt06'
import * as f from '../functions/functions'
import Device from '../device'
import crc16 from '../functions/crc16'

const protocol = 'GT06'
const modelName = 'GT06'
const compatibleHardware = ['GT06/supplier']

class Adapter {
  private device: Device;
  private __count: number;
  private imei: number;
  private msgBufferRaw: Buffer[];
  private msgBuffer: ParsedMsg[];

  constructor (device: Device) {
    this.device = device
    this.msgBufferRaw = new Array<Buffer>()
    this.__count = 1
    this.imei = null
  }

  parseData (data: Buffer): ParsedMsg {
    const parsed: ParsedMsg = {
      expectsResponse: false,
      deviceID: null,
      parseTime: Date.now(),
      event: {
        number: 0,
        string: ''
      },
      data: '',
      responseMsg: Buffer.from('787805FFFFFFFFFF0d0a', 'hex'),
      action: '',
      cmd: ''
    }

    if (!Adapter.checkHeader(data.slice(0, 2))) {
      throw new Error(`Unknown message header: ${data}`)
    }

    this.msgBufferRaw = Adapter.sliceMsgsInBuff(data).slice()
    this.msgBufferRaw.forEach((msg, idx) => {
      switch (Adapter.selectEvent(msg).number) {
        case 0x01: // login message
          parsed.data = Adapter.parseLogin(msg)
          parsed.expectsResponse = true
          parsed.deviceID = Adapter.parseLogin(msg).imei
          parsed.responseMsg = this.createResponse(msg)
          parsed.cmd = Control.loginRequest
          parsed.action = Control.loginRequest
          break
        case 0x12:
          parsed.data = Adapter.parseLocation(msg)
          parsed.cmd = Control.ping
          parsed.action = Control.ping
          break
        case 0x13: // status message
          parsed.data = Adapter.parseStatus(msg)
          parsed.expectsResponse = true
          parsed.responseMsg = this.createResponse(msg)
          parsed.cmd = Control.heartbeat
          parsed.action = Control.heartbeat
          break
        case 0x16:
        case 0x18:
          parsed.data = Adapter.parseAlarm(msg)
          parsed.expectsResponse = true
          parsed.responseMsg = this.createResponse(msg)
          parsed.cmd = Control.alert
          parsed.action = Control.alert
          break
        default:
          console.log({
            error: 'unknown message type',
            event: Adapter.selectEvent(msg)
          })
          break
      }

      parsed.event = Adapter.selectEvent(msg)
      parsed.parseTime = Date.now()

      if (idx === this.msgBufferRaw.length - 1) {
        Object.assign(this, parsed)
      }
      this.msgBuffer.push(parsed)
    })
    return parsed
  }

  clearMsgBuffer (): void {
    this.msgBuffer.length = 0
  }

  authorize (protocol: string): Buffer {
    const length = '05'
    const protocolID = protocol
    const serial = f.strPad(this.__count.toString(), 4, '0')

    const str = Buffer.from(length + protocolID + serial)

    this.__count++

    const errorCheck = f.strPad(crc16(str).toString('hex'), 4, '0')
    const buffer: Buffer = Buffer.from(
      '7878' + str + errorCheck + '0d0a',
      'hex'
    )

    return buffer
  }

  private static checkHeader (header: Buffer): boolean {
    return header.equals(Buffer.from('7878', 'hex'))
  }

  private static selectEvent (data: Buffer): Event {
    let eventStr: string
    switch (data[3]) {
      case 0x01:
        eventStr = 'login'
        break
      case 0x12:
        eventStr = 'location'
        break
      case 0x13:
        eventStr = 'status'
        break
      case 0x16:
        eventStr = 'alarm'
        break
      default:
        eventStr = 'unknown'
        break
    }
    return { number: data[3], string: eventStr }
  }

  private static sliceMsgsInBuff (data: Buffer): Array<Buffer> {
    const startPattern = Buffer.from('7878', 'hex')
    let nextStart = data.indexOf(startPattern, 2)
    const msgArray: Buffer[] = []

    if (nextStart === -1) {
      msgArray.push(data)
      return msgArray
    }
    msgArray.push(data.slice(0, nextStart))
    let redMsgBuff = data.slice(nextStart)

    while (nextStart !== -1) {
      nextStart = redMsgBuff.indexOf(startPattern, 2)
      if (nextStart === -1) {
        msgArray.push(redMsgBuff)
        return msgArray
      }
      msgArray.push(redMsgBuff.slice(0, nextStart))
      redMsgBuff = redMsgBuff.slice(nextStart)
    }
    return msgArray
  }

  private static parseLogin (data: Buffer): ParseLogin {
    return {
      imei: parseInt(data.slice(4, 12).toString('hex'), 10),
      serialNumber: data.readUInt16BE(12)
      // errorCheck: data.readUInt16BE(14)
    }
  }

  private static parseLocation (data: Buffer): ParseLocation {
    const dataSheet = {
      startBit: data.readUInt16BE(0),
      protocolLength: data.readUInt8(2),
      protocolNumber: data.readUInt8(3),
      fixTime: data.slice(4, 10),
      quantity: data.readUInt8(10),
      lat: data.readUInt32BE(11),
      lon: data.readUInt32BE(15),
      speed: data.readUInt8(19),
      course: data.readUInt16BE(20),
      mcc: data.readUInt16BE(22),
      mnc: data.readUInt8(24),
      lac: data.readUInt16BE(25),
      cellId: parseInt(data.slice(27, 30).toString('hex'), 16),
      serialNr: data.readUInt16BE(30),
      errorCheck: data.readUInt16BE(32)
    }

    const parsed: ParseLocation = {
      fixTime: Adapter.parseDateTime(dataSheet.fixTime).toISOString(),
      satCnt: (dataSheet.quantity & 0xf0) >> 4,
      satCntActive: dataSheet.quantity & 0x0f,
      lat: Adapter.decodeGt06LatLon(dataSheet.lat, dataSheet.course),
      lon: Adapter.decodeGt06LatLon(dataSheet.lon, dataSheet.course),
      speed: dataSheet.speed,
      speedUnit: 'km/h',
      orientation: Adapter.getCourseStatus(dataSheet.course),
      mcc: dataSheet.mcc,
      mnc: dataSheet.mnc,
      lac: dataSheet.lac,
      cellId: dataSheet.cellId,
      serialNr: dataSheet.serialNr,
      errorCheck: dataSheet.errorCheck
    }

    return parsed
  }

  private static parseStatus (data: Buffer): ParseStatus {
    const statusInfo = data.slice(4, 9)
    const terminalInfo = Adapter.getDeviceInfo(
      statusInfo.slice(0, 1).readUInt8(0)
    )
    const voltageLevel = Adapter.getVoltageInfo(
      statusInfo.slice(1, 2).readUInt8(0)
    )
    const gsmSigStrength = Adapter.getGSMInfo(
      statusInfo.slice(2, 3).readUInt8(0)
    )

    return {
      terminalInfo: terminalInfo,
      voltageLevel: voltageLevel,
      gsmSigStrength: gsmSigStrength
    }
  }

  private static parseAlarm (data: Buffer): ParseAlarm {
    const dataSheet = {
      startBit: data.readUInt16BE(0),
      protocolLength: data.readUInt8(2),
      protocolNumber: data.readUInt8(3),
      fixTime: data.slice(4, 10),
      quantity: data.readUInt8(10),
      lat: data.readUInt32BE(11),
      lon: data.readUInt32BE(15),
      speed: data.readUInt8(19),
      course: data.readUInt16BE(20),
      mcc: data.readUInt16BE(22),
      mnc: data.readUInt8(24),
      lac: data.readUInt16BE(25),
      cellId: parseInt(data.slice(27, 30).toString('hex'), 16),
      terminalInfo: data.readUInt8(31),
      voltageLevel: data.readUInt8(32),
      gpsSignal: data.readUInt8(33),
      alarmLang: data.readUInt16BE(34),
      serialNr: data.readUInt16BE(36),
      errorCheck: data.readUInt16BE(38)
    }

    const parsed = {
      fixTime: Adapter.parseDateTime(dataSheet.fixTime),
      satCnt: (dataSheet.quantity & 0xf0) >> 4,
      satCntActive: dataSheet.quantity & 0x0f,
      lat: Adapter.decodeGt06LatLon(dataSheet.lat, dataSheet.course),
      lon: Adapter.decodeGt06LatLon(dataSheet.lon, dataSheet.course),
      speed: dataSheet.speed,
      speedUnit: 'km/h',
      orientation: Adapter.getCourseStatus(dataSheet.course),
      mmc: dataSheet.mnc,
      cellId: dataSheet.cellId,
      terminalInfo: Adapter.getDeviceInfo(dataSheet.terminalInfo),
      voltageLevel: Adapter.getVoltageInfo(dataSheet.voltageLevel),
      gpsSignal: Adapter.getGSMInfo(dataSheet.gpsSignal),
      alarmLang: dataSheet.alarmLang,
      serialNr: dataSheet.serialNr,
      errorCheck: dataSheet.errorCheck
    }

    return parsed
  }

  runOther (cmd: string, msgParts: ParsedMsg): void {
    console.log(cmd, msgParts)
  }

  private static getAlarmLanguage (
    formerBit: string,
    latterBit: string
  ): LanguagePack {
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

  private static getDeviceInfo (data: number): TerminalInformation {
    /**
     * Gets the binary string number and parse data to define status information of the mobile phone
     * @param info The binary value of status information. The index of the first character in the string is zero.
     */
    const info = {
      status: Boolean(data & 0x01),
      gpsTracking: Boolean(data & 0x40),
      alarmType: 'normal',
      charging: Boolean(data & 0x04),
      ignition: Boolean(data & 0x02),
      relayState: Boolean(data & 0x80)
    }
    const alarm = (data & 0x38) >> 3
    switch (alarm) {
      case 1:
        info.alarmType = 'shock'
        break
      case 2:
        info.alarmType = 'power cut'
        break
      case 3:
        info.alarmType = 'low battery'
        break
      case 4:
        info.alarmType = 'sos'
        break
      default:
        info.alarmType = 'normal'
        break
    }

    return info
  }

  private static getVoltageInfo (data: number): string {
    let voltageLevelStr = 'no power (shutting down)'
    switch (data) {
      case 1:
        voltageLevelStr = 'extremely low battery'
        break
      case 2:
        voltageLevelStr = 'very low battery (low battery alarm)'
        break
      case 3:
        voltageLevelStr = 'low battery (can be used normally)'
        break
      case 4:
        voltageLevelStr = 'medium'
        break
      case 5:
        voltageLevelStr = 'high'
        break
      case 6:
        voltageLevelStr = 'very high'
        break
      default:
        voltageLevelStr = 'no power (shutting down)'
        break
    }

    return voltageLevelStr
  }

  private static getGSMInfo (data: number): string {
    let gsmSigStrengthStr = 'no signal'
    switch (data) {
      case 1:
        gsmSigStrengthStr = 'extremely weak signal'
        break
      case 2:
        gsmSigStrengthStr = 'very weak signal'
        break
      case 3:
        gsmSigStrengthStr = 'good signal'
        break
      case 4:
        gsmSigStrengthStr = 'strong signal'
        break
      default:
        gsmSigStrengthStr = 'no signal'
        break
    }

    return gsmSigStrengthStr
  }

  private static getCourseStatus (data: number): CourseStatus {
    const result = {
      realTimeGps: Boolean(data & 0x2000),
      gpsPositioned: Boolean(data & 0x1000),
      eastLongitude: !(data & 0x0800),
      northLatitude: Boolean(data & 0x0400),
      course: data & 0x3ff
    }
    return result
  }

  private static parseDateTime (data: Buffer): Date {
    return new Date(
      Date.UTC(data[0] + 2000, data[1] - 1, data[2], data[3], data[4], data[5])
    )
  }

  private static decodeGt06LatLon (pos: number, course: number) {
    let coords = pos / 60.0 / 30000.0
    if (!(course & 0x0400)) {
      coords = -coords
    } else if (course & 0x0800) {
      coords = -coords
    }

    return Math.round(coords * 1000000) / 1000000
  }

  private sendCommand (data: Buffer): void {
    this.device.send(data)
  }

  command (msg: Buffer, type: boolean): Buffer {
    const data = f.bufferToHexString(msg)
    const protocol = '80'
    // protocol + content + serial + errorCheck
    const length = type ? '15' : '16'

    const flagBit = '41505642' // A P V B
    const lengthCommand = flagBit.length + data.length
    const serial = f.strPad(this.__count.toString(), 4, '0')

    const str = Buffer.from(
      length + protocol + lengthCommand + flagBit + data + serial
    )

    this.__count++

    const errorCheck = f.strPad(crc16(str).toString('hex'), 4, '0')

    const buffer = Buffer.from('7878' + str + errorCheck + '0d0a', 'hex')

    return buffer
  }

  private createResponse (data: Buffer) {
    const respRaw = Buffer.from('787805FFFFFFd9dc0d0a', 'hex')
    // we put the protocol of the received message into the response message
    // at position byte 3 (0xFF in the raw message)
    respRaw[3] = data[3]

    this.appendSerial(respRaw)
    Adapter.appendCrc16(respRaw)
    return respRaw
  }

  private static appendCrc16 (data: Buffer) {
    // write the crc16 at the 4th position from the right (2 bytes)
    // the last two bytes are the line ending
    data.writeUInt16BE(
      crc16(data.slice(2, 6)).readUInt16BE(0),
      data.length - 4
    )
  }

  private appendSerial (data: Buffer) {
    const serial = Buffer.from(
      f.strPad(this.__count.toString(16), 4, '0'),
      'hex'
    )
    data.writeUInt16BE(serial.readUInt16BE(0), data.length - 6)
    this.__count++
  }
}

export { protocol, modelName, compatibleHardware, Adapter }
