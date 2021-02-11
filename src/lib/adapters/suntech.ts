import { Socket } from 'net'
import { ReverseGeocoder } from 'open-street-map-reverse-geo-node-client'

import BaseProtocolDecoder from '../controllers/BaseProtocolDecoder'
import BitUtil from '../helpers/BitUtil'
import DateFormat from '../helpers/DateFormat'
import UnitsConverter from '../helpers/UnitsConverter'
import CellTower from '../models/CellTower'
import Network from '../models/Network'
import Position from '../models/Position'
import { TimeZone } from '../models/Timezone'

const compatibleHardware = ['SUNTECH/supplier']
const modelName = 'SUNTECH'
const protocol = 'SUNTECH'

class Adapter extends BaseProtocolDecoder {
  private prefix: string
  private protocolType: number
  private hbm: boolean
  private includeAdc: boolean
  private includeRpm: boolean
  private includeTemp: boolean
  private geo: ReverseGeocoder

  private connection: Socket

  constructor (connection: Socket) {
    super()
    this.connection = connection
    this.geo = new ReverseGeocoder()
  }

  public getPrefix (): string {
    return this.prefix
  }

  public setProtocolType (protocolType: number): void {
    this.protocolType = protocolType
  }

  public getProtocolType (deviceId: number): number {
    // TODO
    return deviceId
  }

  public setHbm (hbm: boolean): void {
    this.hbm = hbm
  }

  public isHbm (type: string, length: number): boolean {
    if ((type === 'STT' || type === 'UEX') && length > 18) return true
    if ((type === 'EMG' || type === 'EVT' || type === 'ALT') && length > 17) { return true } else return false
  }

  public setIncludeAdc (includeAdc: boolean): void {
    this.includeAdc = includeAdc
  }

  public isIncludeAdc (deviceId: number): boolean {
    deviceId ? this.setIncludeAdc(true) : this.setIncludeAdc(false)
    return this.includeAdc
  }

  public setIncludeRpm (includeRpm: boolean): void {
    this.includeRpm = includeRpm
  }

  public isIncludeRpm (deviceId: number): boolean {
    deviceId ? this.setIncludeRpm(true) : this.setIncludeRpm(false)
    return this.includeRpm
  }

  public setIncludeTemp (includeTemp: boolean): void {
    this.includeTemp = includeTemp
  }

  public isIncludeTemp (deviceId: number): boolean {
    deviceId ? this.setIncludeTemp(true) : this.setIncludeTemp(false)
    return this.includeTemp
  }

  private decodeEmergency (value: number): string {
    switch (value) {
      case 1:
        return Position.ALARM_SOS
      case 2:
        return Position.ALARM_PARKING
      case 3:
        return Position.ALARM_POWER_CUT
      case 5:
      case 6:
        return Position.ALARM_DOOR
      case 7:
        return Position.ALARM_MOVEMENT
      case 8:
        return Position.ALARM_SHOCK
      default:
        return null
    }
  }

  private static decodeAlert (value: number): string {
    switch (value) {
      case 1:
        return Position.ALARM_OVERSPEED
      case 5:
        return Position.ALARM_GEOFENCE_EXIT
      case 6:
        return Position.ALARM_GEOFENCE_ENTER
      case 14:
        return Position.ALARM_LOW_BATTERY
      case 15:
        return Position.ALARM_SHOCK
      case 16:
        return Position.ALARM_ACCIDENT
      case 40:
        return Position.ALARM_POWER_RESTORED
      case 41:
        return Position.ALARM_POWER_CUT
      case 46:
        return Position.ALARM_ACCELERATION
      case 47:
        return Position.ALARM_BRAKING
      case 50:
        return Position.ALARM_JAMMING
      default:
        return null
    }
  }

  private async decode9 (values: string[], channel: Socket) {
    let index = 1

    const type = values[index++]

    if (type !== 'Location' && type !== 'Emergency' && type !== 'Alert') {
      return null
    }

    const deviceSession = await this.getDeviceSession(channel, parseInt(values[index++]))

    if (!deviceSession) {
      return null
    }

    const position = new Position()
    position.setDeviceId(deviceSession.deviceSession.getDeviceId())
    position.set('device', deviceSession.device)

    if (type === 'Emergency' || type === 'Alert') {
      position.set(Position.KEY_ALARM, Position.ALARM_GENERAL)
    }

    if (
      type !== 'Alert' ||
      this.getProtocolType(position.getDeviceId()) === 0
    ) {
      position.set(Position.KEY_VERSION_FW, values[index++])
    }
    const dateFormat = new DateFormat()
    dateFormat.setTimeZone('GMT')

    position.setTime(dateFormat.parse(values[index++], values[index++]))
    position.setFixTime(
      dateFormat.fixTime(position.getFixTime(), TimeZone['GMT-3'])
    )

    if (this.getProtocolType(position.getDeviceId()) === 1) {
      index += 1 // cell
    }

    position.setLatitude(parseFloat(values[index++]))
    position.setLongitude(parseFloat(values[index++]))
    position.setSpeed(UnitsConverter.knotsFromKph(parseFloat(values[index++])))
    position.setCourse(parseFloat(values[index++]))

    position.setValid(values[index++] === '1')

    if (this.getProtocolType(position.getDeviceId()) === 1) {
      position.set(Position.KEY_ODOMETER, parseInt(values[index++]))
    }

    return position
  }

  private async decode4 (values: string[], channel: Socket) {
    let index = 0

    const type = values[index++].substring(5)

    if (type !== 'STT' && type !== 'ALT') {
      return null
    }

    const deviceSession = await this.getDeviceSession(channel, parseInt(values[index++]))

    if (!deviceSession) {
      return null
    }

    const position = new Position()
    position.setDeviceId(deviceSession.deviceSession.getDeviceId())
    position.set('device', deviceSession.device)

    position.set(Position.KEY_TYPE, type)

    position.set(Position.KEY_VERSION_FW, values[index++])
    index += 1 // model

    const network = new Network()

    for (let i = 0; i < 7; i++) {
      const cid = parseInt(values[index++])
      const mcc = parseInt(values[index++])
      const mnc = parseInt(values[index++])
      let lac: number
      let rssi: number
      if (i === 0) {
        rssi = parseInt(values[index++])
        lac = parseInt(values[index++])
      } else {
        lac = parseInt(values[index++])
        rssi = parseInt(values[index++])
      }
      index += 1 // timing advance
      if (cid > 0) {
        network.addCellTower(CellTower.from(mcc, mnc, lac, cid, rssi))
      }
    }

    position.setNetwork(network)
    position.set(Position.KEY_BATTERY, parseFloat(values[index++]))
    position.set(Position.KEY_ARCHIVE, values[index++] === '0' ? true : null)
    position.set(Position.KEY_INDEX, parseInt(values[index++]))
    position.set(Position.KEY_STATUS, parseInt(values[index++]))

    if (values[index].length === 3) {
      index += 1 // collaborative network
    }

    const dateFormat = new DateFormat()
    dateFormat.setTimeZone('GMT')
    position.setTime(dateFormat.parse(values[index++], values[index++]))
    position.setFixTime(
      dateFormat.fixTime(position.getFixTime(), TimeZone['GMT-3'])
    )

    position.setLatitude(parseFloat(values[index++]))
    position.setLongitude(parseFloat(values[index++]))
    position.setSpeed(UnitsConverter.knotsFromKph(parseFloat(values[index++])))
    position.setCourse(parseFloat(values[index++]))

    position.set(Position.KEY_SATELLITES, parseInt(values[index++]))

    position.setValid(values[index++] === '1')

    return position
  }

  private async decode2356 (protocol: string, values: string[], channel: Socket) {
    let index = 0
    const type: string = values[index++].substring(5)

    if (
      type !== 'STT' &&
      type !== 'EMG' &&
      type !== 'EVT' &&
      type !== 'ALT' &&
      type !== 'UEX'
    ) {
      return null
    }
    const deviceSession = await this.getDeviceSession(
      channel,
      parseInt(values[index++])
    )
    if (!deviceSession) {
      return null
    }

    const position: Position = new Position()
    position.setDeviceId(deviceSession.deviceSession.getDeviceId())
    position.set('device', deviceSession.device)
    position.set(Position.KEY_TYPE, type)

    if (
      protocol.startsWith('ST3') ||
      protocol === 'ST500' ||
      protocol === 'ST600'
    ) {
      index += 1 // model
    }

    position.set(Position.KEY_VERSION_FW, values[index++])

    const dateFormat = new DateFormat()
    dateFormat.setTimeZone('GMT')
    position.setTime(dateFormat.parse(values[index++], values[index++]))
    position.setFixTime(
      dateFormat.fixTime(position.getFixTime(), TimeZone['GMT-3'])
    )

    if (protocol !== 'ST500') {
      const cid: number = parseInt(values[index++])
      if (protocol === 'ST600') {
        position.setNetwork(
          new Network(
            CellTower.from(
              parseInt(values[index++]),
              parseInt(values[index++]),
              parseInt(values[index++], 16),
              cid,
              parseInt(values[index++])
            )
          )
        )
      }
    }
    position.setLatitude(parseFloat(values[index++]))
    position.setLongitude(parseFloat(values[index++]))

    const resultGeo = await this.geo.getReverse(`${position.getLatitude()}`, `${position.getLongitude()}`)
    console.log(resultGeo)
    position.setSpeed(parseInt(values[index++]))
    position.setCourse(parseInt(values[index++]))

    position.set(Position.KEY_SATELLITES, parseInt(values[index++]))

    position.setValid(values[index++] === '1')

    position.set(Position.KEY_ODOMETER, parseInt(values[index++]))
    position.set(Position.KEY_POWER, parseFloat(values[index++]))
    const io: string = values[index++]

    if (io.length >= 6) {
      position.set(Position.KEY_IGNITION, io.charAt(0) === '1')
      position.set(Position.PREFIX_IN + 1, io.charAt(1) === '1')
      position.set(Position.PREFIX_IN + 2, io.charAt(2) === '1')
      position.set(Position.PREFIX_IN + 3, io.charAt(3) === '1')
      position.set(Position.PREFIX_OUT + 1, io.charAt(4) === '1')
      position.set(Position.PREFIX_OUT + 2, io.charAt(5) === '1')
    }

    switch (type) {
      case 'STT':
        position.set(Position.KEY_STATUS, parseInt(values[index++]))
        position.set(Position.KEY_INDEX, parseInt(values[index++]))
        break
      case 'EMG':
        position.set(
          Position.KEY_ALARM,
          this.decodeEmergency(parseInt(values[index++]))
        )
        break
      case 'EVT':
        position.set(Position.KEY_EVENT, parseInt(values[index++]))
        break
      case 'ALT':
        position.set(
          Position.KEY_ALARM,
          Adapter.decodeAlert(parseInt(values[index++]))
        )
        break
      case 'UEX':
        this.decodeUex(position, parseInt(values[index++]), values[index++])
        index += 1
        break
      default:
        break
    }

    if (this.isHbm(type, values.length)) {
      if (index < values.length) {
        position.set(
          Position.KEY_HOURS,
          UnitsConverter.msFromMinutes(parseInt(values[index++]))
        )
      }

      if (index < values.length) {
        position.set(Position.KEY_BATTERY, parseFloat(values[index++]))
      }

      if (index < values.length && values[index++] === '0') {
        position.set(Position.KEY_ARCHIVE, true)
      }

      if (this.isIncludeAdc(position.getDeviceId())) {
        for (let i = 1; i <= 3; i++) {
          if (index < values.length && !values[index++]) {
            position.set(Position.PREFIX_ADC + i, parseFloat(values[index - 1]))
          }
        }
      }

      if (this.isIncludeRpm(position.getDeviceId())) {
        const value = values[index++]
        if (value) {
          position.set(Position.KEY_RPM, parseInt(value))
        }
      }

      if (values.length - index >= 2) {
        const driverUniqueId: string = values[index++]
        if (values[index++] === '1' && !driverUniqueId) {
          position.set(Position.KEY_DRIVER_UNIQUE_ID, driverUniqueId)
        }
      }

      if (this.isIncludeTemp(position.getDeviceId())) {
        for (let i = 0; i <= 3; i++) {
          const temperature: string = values[index++]
          if (temperature) {
            const value: string = temperature.substring(
              temperature.indexOf(':') + 1
            )
            if (!value) {
              position.set(Position.PREFIX_TEMP + i, parseFloat(value))
            }
          }
        }
      }
    }

    return position
  }

  private async decodeUniversal (values: string[], channel: Socket) {
    let index = 0

    const type = values[index++]

    if (type !== 'STT' && type !== 'ALT') {
      return null
    }

    const deviceSession = await this.getDeviceSession(channel, parseInt(values[index++]))
    if (!deviceSession) {
      return null
    }

    const position = new Position()
    position.setDeviceId(deviceSession.deviceSession.getDeviceId())
    position.set('device', deviceSession.device)
    position.set(Position.KEY_TYPE, type)

    const mask = parseInt(values[index++], 16)

    if (BitUtil.check(mask, 1)) {
      index += 1 // model
    }

    if (BitUtil.check(mask, 2)) {
      position.set(Position.KEY_VERSION_FW, values[index++])
    }

    if (BitUtil.check(mask, 3) && values[index++] === ('0')) {
      position.set(Position.KEY_ARCHIVE, true)
    }

    if (BitUtil.check(mask, 4) && BitUtil.check(mask, 5)) {
      const dateFormat = new DateFormat()
      dateFormat.setTimeZone('UTC')
      position.setTime(dateFormat.parse(values[index++], values[index++]))
    }

    const cellTower = new CellTower()
    if (BitUtil.check(mask, 6)) {
      cellTower.setCellId(parseInt(values[index++], 16))
    }
    if (BitUtil.check(mask, 7)) {
      cellTower.setMobileCountryCode(parseInt(values[index++]))
    }
    if (BitUtil.check(mask, 8)) {
      cellTower.setMobileNetworkCode(parseInt(values[index++]))
    }
    if (BitUtil.check(mask, 9)) {
      cellTower.setLocationAreaCode(parseInt(values[index++], 16))
    }
    if (cellTower.getCellId() !== null) {
      position.setNetwork(new Network(cellTower))
    }

    if (BitUtil.check(mask, 10)) {
      position.set(Position.KEY_RSSI, parseInt(values[index++]))
    }

    if (BitUtil.check(mask, 11)) {
      position.setLatitude(parseInt(values[index++]))
    }

    if (BitUtil.check(mask, 12)) {
      position.setLongitude(parseInt(values[index++]))
    }

    if (BitUtil.check(mask, 13)) {
      position.setSpeed(UnitsConverter.knotsFromKph(parseInt(values[index++])))
    }

    if (BitUtil.check(mask, 14)) {
      position.setCourse(parseInt(values[index++]))
    }

    if (BitUtil.check(mask, 15)) {
      position.set(Position.KEY_SATELLITES, parseInt(values[index++]))
    }

    if (BitUtil.check(mask, 16)) {
      position.setValid(values[index++] === ('1'))
    }

    if (BitUtil.check(mask, 17)) {
      position.set(Position.KEY_INPUT, parseInt(values[index++]))
    }

    if (BitUtil.check(mask, 18)) {
      position.set(Position.KEY_OUTPUT, parseInt(values[index++]))
    }

    if (type === 'ALT') {
      if (BitUtil.check(mask, 19)) {
        position.set('alertId', values[index++])
      }
      if (BitUtil.check(mask, 20)) {
        position.set('alertModifier', values[index++])
      }
      if (BitUtil.check(mask, 21)) {
        position.set('alertData', values[index++])
      }
    } else {
      if (BitUtil.check(mask, 19)) {
        position.set('mode', parseInt(values[index++]))
      }
      if (BitUtil.check(mask, 20)) {
        position.set('reason', parseInt(values[index++]))
      }
      if (BitUtil.check(mask, 21)) {
        position.set(Position.KEY_INDEX, parseInt(values[index++]))
      }
    }

    if (BitUtil.check(mask, 22)) {
      index += 1 // reserved
    }

    if (BitUtil.check(mask, 23)) {
      const assignMask = parseInt(values[index++], 16)
      for (let i = 0; i <= 30; i++) {
        if (BitUtil.check(assignMask, i)) {
          position.set(Position.PREFIX_IO + (i + 1), values[index++])
        }
      }
    }

    return position
  }

  private decodeTravelerReport (values: string[]) {
    let index = 1

    const position = new Position()
    position.setDeviceId(parseInt(values[index++]))

    position.set(Position.KEY_DRIVER_UNIQUE_ID, values[values.length - 1])

    return position
  }

  private decodeUex (position: Position, value1: number, value2: string) {
    let remaining: number = value1
    let totalFuel = 0
    while (remaining > 0) {
      const attribute = value2
      if (attribute.startsWith('CabAVL')) {
        const data: string[] = attribute.split(';')
        const fuel1: number = parseFloat(data[2])
        if (fuel1 > 0) {
          totalFuel += fuel1
          position.set('fuel1', fuel1)
        }
        const fuel2: number = parseFloat(data[3])
        if (fuel2 > 0) {
          totalFuel += fuel2
          position.set('fuel2', fuel2)
        }
      } else {
        const pair: string[] = attribute.split('=')
        if (pair.length >= 2) {
          let value: string = pair[1].trim()
          if (value.includes('.')) {
            value = value.substring(0, value.indexOf('.'))
          }
          let fuel: number
          switch (pair[0].charAt(0)) {
            case 't':
              position.set(
                Position.PREFIX_TEMP + pair[0].charAt(2),
                parseInt(value, 16)
              )
              break
            case 'N':
              fuel = parseInt(value, 16)
              totalFuel += fuel
              position.set('fuel' + pair[0].charAt(2), fuel)
              break
            case 'Q':
              position.set('drivingQuality', parseInt(value, 16))
              break
            default:
              break
          }
        }
      }
      remaining -= attribute.length + 1
    }
    if (totalFuel > 0) {
      position.set(Position.KEY_FUEL_LEVEL, totalFuel)
    }
  }

  async decode (data: Buffer) {
    const values: string[] = data.toString().split(';')

    this.prefix = values[0]

    if (this.prefix.length < 5) {
      return await this.decodeUniversal(values, this.connection)
    } else if (this.prefix.endsWith('HTE')) {
      return this.decodeTravelerReport(values)
    } else if (this.prefix.startsWith('ST9')) {
      return await this.decode9(values, this.connection)
    } else if (this.prefix.startsWith('ST4')) {
      return await this.decode4(values, this.connection)
    } else {
      return await this.decode2356(this.prefix.substring(0, 5), values, this.connection)
    }
  }
}

export { protocol, modelName, compatibleHardware, Adapter }
