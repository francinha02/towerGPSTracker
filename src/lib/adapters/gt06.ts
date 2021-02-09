import { Socket } from 'net'

import BaseProtocolDecoder from '../controllers/BaseProtocolDecoder'
import DeviceSession from '../controllers/DeviceSession'
import Device from '../device'
import crc16 from '../functions/crc16'
import * as f from '../functions/functions'
import BitUtil from '../helpers/BitUtil'
import DateBuilder from '../helpers/DateBuilder'
import UnitsConverter from '../helpers/UnitsConverter'
import CellTower from '../models/CellTower'
import Network from '../models/Network'
import Position from '../models/Position'

const compatibleHardware = ['GT06/supplier']
const modelName = 'GT06'
const protocol = 'GT06'

class Adapter extends BaseProtocolDecoder {
  public static MSG_LOGIN = 0x01
  public static MSG_GPS = 0x10
  public static MSG_LBS = 0x11
  public static MSG_GPS_LBS_1 = 0x12
  public static MSG_GPS_LBS_2 = 0x22
  public static MSG_GPS_LBS_3 = 0x37
  public static MSG_STATUS = 0x13
  public static MSG_SATELLITE = 0x14
  public static MSG_STRING = 0x15
  public static MSG_GPS_LBS_STATUS_1 = 0x16
  public static MSG_WIFI = 0x17
  public static MSG_GPS_LBS_STATUS_2 = 0x26
  public static MSG_GPS_LBS_STATUS_3 = 0x27
  public static MSG_LBS_MULTIPLE = 0x28
  public static MSG_LBS_WIFI = 0x2c
  public static MSG_LBS_EXTEND = 0x18
  public static MSG_LBS_STATUS = 0x19
  public static MSG_GPS_PHONE = 0x1a
  public static MSG_GPS_LBS_EXTEND = 0x1e
  public static MSG_HEARTBEAT = 0x23
  public static MSG_ADDRESS_REQUEST = 0x2a
  public static MSG_ADDRESS_RESPONSE = 0x97
  public static MSG_AZ735_GPS = 0x32
  public static MSG_AZ735_ALARM = 0x33
  public static MSG_X1_GPS = 0x34
  public static MSG_X1_PHOTO_INFO = 0x35
  public static MSG_X1_PHOTO_DATA = 0x36
  public static MSG_WIFI_2 = 0x69
  public static MSG_GPS_MODULAR = 0x70
  public static MSG_WIFI_4 = 0xf3
  public static MSG_COMMAND_0 = 0x80
  public static MSG_COMMAND_1 = 0x81
  public static MSG_COMMAND_2 = 0x82
  public static MSG_TIME_REQUEST = 0x8a
  public static MSG_INFO = 0x94
  public static MSG_SERIAL = 0x9b
  public static MSG_STRING_INFO = 0x21
  public static MSG_GPS_2 = 0xa0
  public static MSG_LBS_2 = 0xa1
  public static MSG_WIFI_3 = 0xa2
  public static MSG_FENCE_SINGLE = 0xa3
  public static MSG_FENCE_MULTI = 0xa4
  public static MSG_LBS_ALARM = 0xa5
  public static MSG_LBS_ADDRESS = 0xa7
  public static MSG_OBD = 0x8c
  public static MSG_DTC = 0x65
  public static MSG_PID = 0x66
  public static MSG_BMS = 0x20
  public static MSG_MULTIMEDIA = 0x21
  public static MSG_BMS_2 = 0x40
  public static MSG_MULTIMEDIA_2 = 0x41
  public static MSG_ALARM = 0x95
  private __count: number
  private device: Device
  private connection: Socket
  private index: number
  private deviceSession: DeviceSession

  constructor (device: Device, connection: Socket) {
    super()
    this.connection = connection
    this.device = device
    this.__count = 1
    this.deviceSession = null
  }

  public command (msg: Buffer, type: boolean): Buffer {
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

  private static appendCrc16 (data: Buffer) {
    // write the crc16 at the 4th position from the right (2 bytes)
    // the last two bytes are the line ending
    data.writeUInt16BE(crc16(data.slice(2, 6)).readUInt16BE(0), data.length - 4)
  }

  private appendSerial (data: Buffer) {
    const serial = Buffer.from(
      f.strPad(this.__count.toString(16), 4, '0'),
      'hex'
    )
    data.writeUInt16BE(serial.readUInt16BE(0), data.length - 6)
    this.__count++
  }

  public async decode (msg: Buffer) {
    this.index = 0
    const header = msg.readInt16BE(this.index++)
    this.index++
    if (header === 0x7878) {
      return await this.decodeBasic(msg)
    } else if (header === 0x7979) {
      console.log('Decode Extend')
    }
  }

  private sendResponse (extended: boolean, type: number, data: Buffer) {
    if (this.connection) {
      let index = 0

      const length = 5 + (data ? data.length - this.index : 0)
      const response = extended ? Buffer.alloc(length + 5) : Buffer.alloc(10)

      if (extended) {
        response.writeUInt16BE(0x7979, index++)
        index++
        response.writeUInt16BE(length, index++)
        index++
      } else {
        response.writeUInt16BE(0x7878, index++)
        index++
        response.writeUInt8(length, index++)
      }

      response.writeUInt8(type, index++)

      if (data) {
        response.writeUInt16LE(parseInt(data.toString('hex'), 16), index++)
        index++
      }
      this.appendSerial(response)
      Adapter.appendCrc16(response)
      response.writeUInt16BE(0x0d0a, response.length - 2)
      this.connection.write(response)
    }
  }

  private static isSupported (type: number): boolean {
    return (
      Adapter.hasGps(type) || Adapter.hasLbs(type) || Adapter.hasStatus(type)
    )
  }

  private static hasGps (type: number): boolean {
    switch (type) {
      case Adapter.MSG_GPS:
      case Adapter.MSG_GPS_LBS_1:
      case Adapter.MSG_GPS_LBS_2:
      case Adapter.MSG_GPS_LBS_3:
      case Adapter.MSG_GPS_LBS_STATUS_1:
      case Adapter.MSG_GPS_LBS_STATUS_2:
      case Adapter.MSG_GPS_LBS_STATUS_3:
      case Adapter.MSG_GPS_PHONE:
      case Adapter.MSG_GPS_LBS_EXTEND:
      case Adapter.MSG_GPS_2:
      case Adapter.MSG_FENCE_SINGLE:
      case Adapter.MSG_FENCE_MULTI:
        return true
      default:
        return false
    }
  }

  private static hasLbs (type: number): boolean {
    switch (type) {
      case Adapter.MSG_LBS:
      case Adapter.MSG_LBS_STATUS:
      case Adapter.MSG_GPS_LBS_1:
      case Adapter.MSG_GPS_LBS_2:
      case Adapter.MSG_GPS_LBS_3:
      case Adapter.MSG_GPS_LBS_STATUS_1:
      case Adapter.MSG_GPS_LBS_STATUS_2:
      case Adapter.MSG_GPS_LBS_STATUS_3:
      case Adapter.MSG_GPS_2:
      case Adapter.MSG_FENCE_SINGLE:
      case Adapter.MSG_FENCE_MULTI:
      case Adapter.MSG_LBS_ALARM:
      case Adapter.MSG_LBS_ADDRESS:
        return true
      default:
        return false
    }
  }

  private static hasStatus (type: number): boolean {
    switch (type) {
      case Adapter.MSG_STATUS:
      case Adapter.MSG_LBS_STATUS:
      case Adapter.MSG_GPS_LBS_STATUS_1:
      case Adapter.MSG_GPS_LBS_STATUS_2:
      case Adapter.MSG_GPS_LBS_STATUS_3:
        return true
      default:
        return false
    }
  }

  private static hasLanguage (type: number): boolean {
    switch (type) {
      case Adapter.MSG_GPS_PHONE:
      case Adapter.MSG_HEARTBEAT:
      case Adapter.MSG_GPS_LBS_STATUS_3:
      case Adapter.MSG_LBS_MULTIPLE:
      case Adapter.MSG_LBS_2:
      case Adapter.MSG_FENCE_MULTI:
        return true
      default:
        return false
    }
  }

  private async decodeBasic (buf: Buffer) {
    const length = buf.readUInt8(this.index++)
    const dataLength = length - 5
    const type = buf.readUInt8(this.index++)

    if (type !== Adapter.MSG_LOGIN) {
      this.deviceSession = await this.getDeviceSession(
        this.connection,
        this.deviceSession.getDeviceId()
      )

      if (!this.deviceSession) {
        return null
      }
    }
    if (type === Adapter.MSG_LOGIN) {
      const imei = parseInt(
        buf.slice(this.index++, (this.index = this.index + 7)).toString('hex'), 10
      )

      // Get the equipment number from the database
      this.deviceSession = await this.getDeviceSession(this.connection, imei)

      this.index = this.index + 2

      if (dataLength > 10) {
        const extensionBits = buf.readUInt16BE(this.index++)
        this.index++
        const hours = (extensionBits >> 4) / 100
        const minutes = (extensionBits >> 4) % 100
        let offset = (hours * 60 + minutes) * 60

        if ((extensionBits & 0x8) !== 0) {
          offset = offset * -1
          console.log(offset)
        }
      }

      if (this.deviceSession) {
        // Responde ao pacote
        this.sendResponse(false, type, null)
      }
    } else if (type === Adapter.MSG_HEARTBEAT) {
      const position = new Position()
      position.setDeviceId(this.deviceSession.getDeviceId())
      const status = buf.readUInt8(this.index++)

      position.set(Position.KEY_ARMED, BitUtil.check(status, 0))
      position.set(Position.KEY_IGNITION, BitUtil.check(status, 1))
      position.set(Position.KEY_CHARGE, BitUtil.check(status, 2))

      if (buf.length - this.index + 1 - this.index >= 2 + 6) {
        position.set(Position.KEY_BATTERY, buf.readInt16BE(this.index++) * 0.01)
        this.index++
        position.set(Position.KEY_BATTERY, buf.readInt16BE(this.index++) * 0.01)
        this.index++
      }
      if (buf.length - this.index + 1 - this.index >= 1 + 6) {
        position.set(Position.KEY_BATTERY, buf.readInt16BE(this.index++))
        this.index++
        position.set(Position.KEY_BATTERY, buf.readInt16BE(this.index++) * 0.01)
        this.index++
      }

      // Responde ao pacote
      this.sendResponse(false, type, null)

      return position
    } else if (type === Adapter.MSG_ADDRESS_REQUEST) {
      const response = 'NA&&NA&&0##'
      console.log(response)
    } else if (type === Adapter.MSG_TIME_REQUEST) {
      // Get Calendar and respond to packet
      const calendar = new Date()
      const content = Buffer.alloc(6)
      content.writeUInt8(calendar.getFullYear() - 2000, 0)
      content.writeUInt8(calendar.getMonth() + 1, 1)
      content.writeUInt8(calendar.getDate(), 2)
      content.writeUInt8(calendar.getHours(), 3)
      content.writeUInt8(calendar.getMinutes(), 4)
      content.writeUInt8(calendar.getSeconds(), 5)

      this.sendResponse(false, Adapter.MSG_TIME_REQUEST, content)
    } else if (
      type === Adapter.MSG_X1_GPS ||
      type === Adapter.MSG_X1_PHOTO_INFO
    ) {
      // return this.decodeX1(chanel, buf, deviceSession, type, dataLength)
    } else if (
      type === Adapter.MSG_WIFI ||
      type === Adapter.MSG_WIFI_2 ||
      type === Adapter.MSG_WIFI_4
    ) {
      // return this.decodeWifi(channel, buf, deviceSession, type);
    } else if (type === Adapter.MSG_INFO) {
      const position = new Position()
      position.setDeviceId(this.deviceSession.getDeviceId())

      position.set(Position.KEY_POWER, buf.readUInt16BE(this.index++) * 0.01)
      this.index++
      return position
    } else {
      return this.decodeBasicOther(buf, type, dataLength)
    }
    return null
  }

  private decodeBasicOther (buf: Buffer, type: number, dataLength: number) {
    const position = new Position()
    position.setDeviceId(this.deviceSession.getDeviceId())

    if (
      type === Adapter.MSG_LBS_MULTIPLE ||
      type === Adapter.MSG_LBS_EXTEND ||
      type === Adapter.MSG_LBS_WIFI ||
      type === Adapter.MSG_LBS_2 ||
      type === Adapter.MSG_WIFI_3
    ) {
      const longFormat =
        type === Adapter.MSG_LBS_2 || type === Adapter.MSG_WIFI_3

      const dateBuilder = new DateBuilder()
        .setDate(
          buf.readUInt8(this.index++),
          buf.readUInt8(this.index++),
          buf.readUInt8(this.index++)
        )
        .setTime(
          buf.readUInt8(this.index++),
          buf.readUInt8(this.index++),
          buf.readUInt8(this.index++)
        )
      console.log(dateBuilder)

      const mcc = buf.readUInt16BE(this.index++)
      this.index++
      const mnc = BitUtil.check(mcc, 15)
        ? parseInt(
            `${buf.readUInt8(this.index++)}${buf.readUInt8(this.index++)}`
          )
        : buf.readUInt8(this.index++)

      const network = new Network()

      for (let i = 0; i < 7; i++) {
        const lac = longFormat
          ? buf.readUInt32BE(this.index++)
          : buf.readUInt16BE(this.index++)
        this.index = longFormat ? (this.index = this.index + 3) : this.index++
        const cid = longFormat
          ? Number(buf.readBigUInt64BE(this.index++))
          : parseInt(
              `${buf.readUInt8(this.index++)}${buf.readUInt8(
                this.index++
              )}${buf.readUInt8(this.index++)}`
          )
        this.index = longFormat ? (this.index = this.index + 7) : this.index
        const rssi = -buf.readUInt16BE(this.index++)
        this.index++
        if (lac > 0) {
          network.addCellTower(
            CellTower.from(BitUtil.to(mcc, 15), mnc, lac, cid, rssi)
          )
        }
      }
      this.index++
    } else if (type === Adapter.MSG_STRING) {
      //
      console.log('String')
    } else if (type === Adapter.MSG_BMS || type === Adapter.MSG_BMS_2) {
      this.index = this.index + 8

      position.set('relativeCapacity', buf.readUInt8(this.index++))
      position.set('remainingCapacity', buf.readUInt16BE(this.index++))
      this.index++
      position.set('absoluteCapacity', buf.readUInt8(this.index++))
      position.set('fullCapacity', buf.readUInt16BE(this.index++))
      this.index++
      position.set('batteryHealth', buf.readUInt8(this.index++))
      position.set('batteryTemp', buf.readUInt16BE(this.index++) * 0.1 - 273.1)
      this.index++
      position.set('current', buf.readUInt16BE(this.index++))
      this.index++
      position.set(Position.KEY_BATTERY, buf.readUInt16BE(this.index++) * 0.001)
      this.index++
      position.set('cycleIndex', buf.readUInt16BE(this.index++))
      this.index++
      for (let i = 1; i <= 14; i++) {
        position.set('batteryCell' + i, buf.readUInt16BE(this.index++) * 0.001)
        this.index++
      }
      position.set('currentChargeInterval', buf.readUInt16BE(this.index++))
      this.index++
      position.set('maxChargeInterval', buf.readUInt16BE(this.index++))
      this.index++
      this.index = this.index + 16
      position.set('batteryVersion', buf.readUInt16BE(this.index++))
      this.index++
      this.index = this.index + 16
      position.set('batteryStatus', buf.readUInt32BE(this.index++))
      this.index = this.index + 3

      position.set('controllerStatus', buf.readUInt32BE(this.index++))
      this.index = this.index + 3
      position.set('controllerFault', buf.readUInt32BE(this.index++))
      this.index = this.index + 3

      this.sendResponse(false, type, null)

      return position
    } else if (Adapter.isSupported(type)) {
      if (type === Adapter.MSG_STATUS && buf.length - this.index === 22) {
        this.decodeHeartbeat(buf, position)
      } else {
        this.decodeBasicUniversal(buf, type, position)
      }
    } else if (type === Adapter.MSG_ALARM) {
      const extendedAlarm = dataLength > 7
      if (extendedAlarm) {
        this.decodeGps(position, buf, false, false, false)
      } else {
        const dateBuilder = new DateBuilder()
          .setDate(
            buf.readUInt8(this.index++),
            buf.readUInt8(this.index++),
            buf.readUInt8(this.index++)
          )
          .setTime(
            buf.readUInt8(this.index++),
            buf.readUInt8(this.index++),
            buf.readUInt8(this.index++)
          )
        console.log(dateBuilder)
      }
      const alarmType = buf.readUInt8(this.index++)
      switch (alarmType) {
        case 0x01:
          position.set(
            Position.KEY_ALARM,
            extendedAlarm ? Position.ALARM_SOS : Position.ALARM_GENERAL
          )
          break
        case 0x80:
          position.set(Position.KEY_ALARM, Position.ALARM_VIBRATION)
          break
        case 0x87:
          position.set(Position.KEY_ALARM, Position.ALARM_OVERSPEED)
          break
        case 0x90:
          position.set(Position.KEY_ALARM, Position.ALARM_ACCELERATION)
          break
        case 0x91:
          position.set(Position.KEY_ALARM, Position.ALARM_BRAKING)
          break
        case 0x92:
          position.set(Position.KEY_ALARM, Position.ALARM_CORNERING)
          break
        case 0x93:
          position.set(Position.KEY_ALARM, Position.ALARM_ACCIDENT)
          break
        default:
          position.set(Position.KEY_ALARM, Position.ALARM_GENERAL)
          break
      }
    } else {
      if (dataLength > 0) {
        this.index = this.index + dataLength
      }
      if (
        type !== Adapter.MSG_COMMAND_0 &&
        type !== Adapter.MSG_COMMAND_1 &&
        type !== Adapter.MSG_COMMAND_2
      ) {
        console.log('Responde ao pacote')
      }
      console.log('Não sei porque => null')
      return null
    }

    if (Adapter.hasLanguage(type)) {
      this.index = this.index + 2
    }

    if (
      type === Adapter.MSG_GPS_LBS_STATUS_3 ||
      type === Adapter.MSG_FENCE_MULTI
    ) {
      position.set(Position.KEY_GEOFENCE, buf.readUInt8(this.index++))
    }

    return position
  }

  private decodeHeartbeat (buf: Buffer, position: Position) {
    console.log(buf.readUInt8(this.index++).toString(16)) // information content
    console.log(buf.readUInt16BE(this.index++).toString(16)) // satellites
    this.index++
    console.log(buf.readUInt8(this.index++).toString(16)) // alarm
    console.log(buf.readUInt8(this.index++).toString(16)) // language
    console.log(buf.readUInt8(this.index++).toString(16)) // battery
    console.log(buf.readUInt8(this.index++).toString(16)) // working mode
    console.log(buf.readUInt16BE(this.index++).toString(16)) // working voltage
    this.index++
    console.log(buf.readUInt8(this.index++).toString(16)) // reserved
    console.log(buf.readUInt16BE(this.index++).toString(16)) // working times
    this.index++
    console.log(buf.readUInt16BE(this.index++).toString(16)) // working time
    this.index++

    const value = buf.readUInt16BE(this.index++)
    this.index++
    const temperature = BitUtil.to(value, 15) * 0.1
    position.set(
      Position.PREFIX_TEMP + 1,
      BitUtil.check(value, 15) ? temperature : -temperature
    )
  }

  private decodeGps (
    position: Position,
    buf: Buffer,
    hasLength: boolean,
    hasSatellite: boolean,
    hasSpeed: boolean
  ) {
    const dateBuilder = new DateBuilder()
      .setDate(
        buf.readUInt8(this.index++),
        buf.readUInt8(this.index++),
        buf.readUInt8(this.index++)
      )
      .setTime(
        buf.readUInt8(this.index++),
        buf.readUInt8(this.index++),
        buf.readUInt8(this.index++)
      )
    position.setTime(dateBuilder.getDate())

    if (hasLength && buf.readUInt8(this.index++) === 0) {
      return false
    }

    if (hasSatellite) {
      position.set(
        Position.KEY_SATELLITES,
        BitUtil.to(buf.readUInt8(this.index++), 4)
      )
    }

    let latitude = buf.readUInt32BE(this.index++) / 60.0 / 30000.0
    this.index = this.index + 3
    let longitude = buf.readUInt32BE(this.index++) / 60.0 / 30000.0
    this.index = this.index + 3

    if (hasSpeed) {
      position.setSpeed(
        UnitsConverter.knotsFromKph(buf.readUInt8(this.index++))
      )
    }

    const flags = buf.readUInt16BE(this.index++)
    this.index++
    position.setCourse(BitUtil.to(flags, 10))
    position.setValid(BitUtil.check(flags, 12))

    if (!BitUtil.check(flags, 10)) {
      latitude = -latitude
    }
    if (BitUtil.check(flags, 11)) {
      longitude = -longitude
    }
    position.setLatitude(latitude)
    position.setLongitude(longitude)

    if (BitUtil.check(flags, 14)) {
      position.set(Position.KEY_IGNITION, BitUtil.check(flags, 15))
    }
    return true
  }

  private decodeLbs (position: Position, buf: Buffer, hasLength: boolean) {
    let length = 0

    if (hasLength) {
      length = buf.readUInt8(this.index++)
      // if (length === 0) {
      //   let zeroedData = true
      //   for (let i = index + 9; i < index + 45 && i < buf.length; i++) {
      //     if (buf.readUInt8(i) !== 0) { zeroedData = false }
      //     break
      //   }
      // }
    }

    const mcc = buf.readUInt16BE(this.index++)
    let mnc: number
    this.index++
    if (BitUtil.check(mcc, 15)) {
      mnc = buf.readUInt16BE(this.index++)
      this.index++
    } else {
      mnc = buf.readUInt8(this.index++)
    }
    position.setNetwork(
      new Network(
        CellTower.from(
          BitUtil.to(mcc, 15),
          mnc,
          buf.readUInt16BE(this.index++),
          parseInt(
            `${buf.readUInt8(this.index++)}${buf.readUInt8(
              this.index++
            )}${buf.readUInt8(this.index++)}`
          )
        )
      )
    )

    if (length > 9) {
      this.index = this.index + length - 9
    }

    return true
  }

  private decodeBasicUniversal (buf: Buffer, type: number, position: Position) {
    if (Adapter.hasGps(type)) {
      this.decodeGps(position, buf, false, true, true)
    }

    if (Adapter.hasLbs(type)) {
      this.decodeLbs(position, buf, Adapter.hasStatus(type))
    }

    if (Adapter.hasStatus(type)) {
      this.decodeStatus(position, buf)
    }

    if (type === Adapter.MSG_GPS_LBS_1 && buf.length - this.index > 75 + 6) {
      position.set(Position.KEY_ODOMETER, buf.readUInt32BE(this.index++))
      this.index = this.index + 3
      this.index = this.index + buf.readUInt8(this.index++)
    }
  }

  private decodeStatus (position: Position, buf: Buffer) {
    const status = buf.readUInt8(this.index++)
    position.set(Position.KEY_STATUS, status)
    position.set(Position.KEY_IGNITION, BitUtil.check(status, 1))
    position.set(Position.KEY_CHARGE, BitUtil.check(status, 2))
    position.set(Position.KEY_BLOCKED, BitUtil.check(status, 7))
    switch (BitUtil.between(status, 3, 6)) {
      case 1:
        position.set(Position.KEY_ALARM, Position.ALARM_SHOCK)
        break
      case 2:
        position.set(Position.KEY_ALARM, Position.ALARM_POWER_CUT)
        break
      case 3:
        position.set(Position.KEY_ALARM, Position.ALARM_LOW_BATTERY)
        break
      case 4:
        position.set(Position.KEY_ALARM, Position.ALARM_SOS)
        break
      case 7:
        position.set(Position.KEY_ALARM, Position.ALARM_REMOVING)
        break
      default:
        break
    }
    position.set(
      Position.KEY_BATTERY_LEVEL,
      (buf.readUInt8(this.index++) * 100) / 6
    )
    position.set(Position.KEY_RSSI, buf.readUInt8(this.index++))
    position.set(
      Position.KEY_ALARM,
      this.decodeAlarm(buf.readUInt8(this.index++))
    )

    return true
  }

  private decodeAlarm (value: number) {
    switch (value) {
      case 0x01:
        return Position.ALARM_SOS
      case 0x02:
        return Position.ALARM_POWER_CUT
      case 0x03:
      case 0x09:
        return Position.ALARM_VIBRATION
      case 0x04:
        return Position.ALARM_GEOFENCE_ENTER
      case 0x05:
        return Position.ALARM_GEOFENCE_EXIT
      case 0x06:
        return Position.ALARM_OVERSPEED
      case 0x0e:
      case 0x0f:
        return Position.ALARM_LOW_BATTERY
      case 0x11:
        return Position.ALARM_POWER_OFF
      case 0x13:
        return Position.ALARM_TAMPERING
      case 0x14:
        return Position.ALARM_DOOR
      case 0x29:
        return Position.ALARM_ACCELERATION
      case 0x30:
        return Position.ALARM_BRAKING
      case 0x2a:
      case 0x2b:
        return Position.ALARM_CORNERING
      case 0x2c:
        return Position.ALARM_ACCIDENT
      case 0x23:
        return Position.ALARM_FALL_DOWN
      default:
        return null
    }
  }
}

export { protocol, modelName, compatibleHardware, Adapter }

// const a = new Adapter()
// const buf = Buffer.from('78780d010352887071911998000479d00d0a', 'hex')
// a.decode(buf)
// console.log(a.parseData(buf))
