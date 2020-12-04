import { EventEmitter } from 'events'
import { AddressInfo, Socket } from 'net'
import { Adapter } from './adapters/gt06'
import { Control, Parts } from './models/gt06'

export default class Device extends EventEmitter {
  private connection: Socket
  private server
  private adapter: Adapter
  private uid: string
  ip: string
  port: number
  private name
  private logged: boolean

  constructor (adapter: Adapter, connection: Socket, gpsServer) {
    super()

    this.connection = connection
    this.server = gpsServer
    this.adapter = adapter

    const address = <AddressInfo>connection.address()
    this.ip = address.address
    this.port = address.port
    this.name = false
    this.logged = false

    /****************************************
    RECEIVING DATA FROM THE DEVICE
    ****************************************/
    this.on('data', (data) => {
      const msgParts = this.adapter.parseData(data)

      if (!this.getUID() && typeof (msgParts.deviceID) === 'undefined') {
        this.doLog('The adapter doesn\'t return the deviceID and is not defined\r\n')
      }

      if (!msgParts) {
        this.doLog(`The message ('${data}' can't be parsed. Discarding...)\r\n`)
        return
      }

      if (typeof (msgParts.cmd) === 'undefined') {
        this.doLog('The adapter doesn\'t return the command (cmd) parameter\r\n')
      }

      // If the UID of the devices it hasn't been configured, do it now.
      if (!this.getUID()) {
        this.setUID(msgParts.deviceID)
      }

      /************************************
      EXECUTE ACTION
      ************************************/
      this.makeAction(msgParts.action, msgParts)
    })
  }

  makeAction (action: string, msgParts: Parts) {
    // If we're not logged
    if (action !== Control.loginRequest && !this.logged) {
      this.adapter.requestLoginToDevice()
      this.doLog(`${this.getUID()} is trying to '${action}' but it isn't logged. Action wasn't executed\r\n`)
      return false
    }

    switch (action) {
      case Control.loginRequest:
        this.loginRequest(msgParts)
        break
      case Control.ping:
        this.ping(msgParts)
        break
      case Control.alert:
        this.receiveAlarm(msgParts)
        break
      case Control.noop:
        this.adapter.runOther(msgParts.cmd, msgParts)
        break
    }
  }

  /****************************************
  LOGIN & LOGOUT
  ****************************************/
  loginRequest (msgParts: Parts) {
    this.emit(Control.loginRequest, this.getUID(), msgParts)
  }

  loginAuthorized (val: boolean, msgParts: Parts) {
    if (val) {
      this.doLog(`Device ${this.getUID()} has been authorized. Welcome!\r\n`)
      this.logged = true
      const send = this.adapter.authorize()
      this.send(send)
    }
  }

  // TODO implement this
  logout () {
    this.logged = false
    // this.adapter.logout()
  }

  /****************************************
  RECEIVING GPS POSITION FROM THE DEVICE
  ****************************************/
  ping (msgParts: Parts) {
    const gpsData = this.adapter.getPingData(msgParts)
    if (!gpsData) {
      // Something bad happened
      this.doLog('GPS Data can\'t be parsed. Discarding packet...\r\n')
      return false
    }

    /* Needs:
      latitude, longitude, time
      Optionals:
      orientation, speed, mileage, etc */

    this.doLog(`Position received ('${gpsData.latitude}', '${gpsData.longitude}')\r\n`)
    Object.defineProperty(gpsData, 'fromCMD', { enumerable: true, value: msgParts.cmd })
    this.emit(Control.ping, gpsData, msgParts)
  }

  /****************************************
  RECEIVING ALARM
  *****************************************/
  receiveAlarm (msgParts: Parts) {
    // We pass the message parts to the adapter and they have to say with type of alarm it is.
    const alarmData = this.adapter.receiveAlarm(msgParts)

    if (!alarmData) {
      // Something bad happened
      this.doLog('GPS Alarm Data can\'t be parsed. Discarding packet...\r\n')
      return false
    }
    /* Alarm data must return an object with at least:
    alarm_type: object with this format:
    {'code':'sos_alarm','msg':'SOS Alarm activated by the driver'}
    */
    this.doLog(`${alarmData.deviceInfo.alarm} alarm received. Battery is ${alarmData.power}. GSM with ${alarmData.gsm}.`)
    this.emit(Control.alert, alarmData.deviceInfo, alarmData.power, alarmData.gsm, alarmData.alarmLang, msgParts)
  }

  /****************************************
  SET REFRESH TIME
  ****************************************/
  setRefreshTime (interval, duration) {
    this.adapter.setRefreshTime(interval, duration)
  }

  /* adding methods to the adapter */
  getDevice () {
    return Device
  }

  send (msg: Buffer | string) {
    this.emit('Send data', msg)
    const data = this.adapter.bufferToHexString(msg)
    this.doLog(`Sending to ${this.getUID()}: ${data}\r\n`)
    this.connection.write(msg, (err) => {
      if (err) console.log('Error sending: ', err)
    })
  }

  doLog (msg: string) {
    this.server.doLog(msg, this.getUID())
  }

  /****************************************
  SOME SETTERS & GETTERS
  ****************************************/
  getName () {
    return this.name
  }

  setName (name) {
    this.name = name
  }

  getUID () {
    return this.uid
  }

  setUID (uid) {
    this.uid = uid
  }
}
