import { EventEmitter } from 'events'
import { AddressInfo, Socket } from 'net'
import { Adapter } from './adapters/gt06'
import {
  Control,
  ParseAlarm,
  ParsedMsg,
  ParseLocation,
  ParseStatus
} from './models/gt06'
import * as f from './functions/functions'

export default class Device extends EventEmitter {
  private connection: Socket;
  private server;
  private adapter: Adapter;
  uid: number;
  ip: string;
  port: number;
  private name: string | boolean;
  private logged: boolean;

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

      if (!this.getUID() && typeof msgParts.deviceID === 'undefined') {
        this.doLog(
          "The adapter doesn't return the deviceID and is not defined\r\n"
        )
      }

      if (!msgParts) {
        this.doLog(
          `The message ('${data}' can't be parsed. Discarding...)\r\n`
        )
        return
      }

      if (typeof msgParts.cmd === 'undefined') {
        this.doLog(
          "The adapter doesn't return the command (cmd) parameter\r\n"
        )
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

  private makeAction (action: string, msgParts: ParsedMsg) {
    // If we're not logged
    if (action !== Control.loginRequest && !this.logged) {
      // this.adapter.requestLoginToDevice()
      this.doLog(
        `${this.getUID()} is trying to '${action}' but it isn't logged. Action wasn't executed\r\n`
      )
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
      case Control.heartbeat:
        this.receiveHeartbeat(msgParts)
        break
      case Control.replied:
        this.runOther(msgParts.cmd, msgParts)
        break
    }

    return true
  }

  /****************************************
  LOGIN & LOGOUT
  ****************************************/
  private loginRequest (msgParts: ParsedMsg): void {
    this.emit(Control.loginRequest, this.getUID(), msgParts)
  }

  loginAuthorized (val: boolean, msgPart: ParsedMsg): void {
    if (val) {
      this.doLog(`Device ${this.getUID()} has been authorized. Welcome!\r\n`)
      this.logged = true
      this.send(msgPart.responseMsg)
    }
  }

  responsePacket (val: boolean, msgParts: ParsedMsg): void {
    if (val) {
      this.send(msgParts.responseMsg)
    }
  }

  sendCommand (msg: Buffer, type: boolean): void {
    const command = this.adapter.command(msg, type)
    this.send(command)
  }

  // TODO implement this
  logout (): void {
    this.logged = false
    // this.adapter.logout()
  }

  /****************************************
  RECEIVING GPS POSITION FROM THE DEVICE
  ****************************************/
  private ping (msgParts: ParsedMsg): boolean {
    const gpsData: ParseLocation = <ParseLocation>msgParts.data
    if (!gpsData) {
      // Something bad happened
      this.doLog("GPS Data can't be parsed. Discarding packet...\r\n")
      return false
    }

    /* Needs:
      latitude, longitude, time
      Optionals:
      orientation, speed, mileage, etc */

    this.doLog(`Position received ('${gpsData.lat}', '${gpsData.lon}')\r\n`)

    this.emit(Control.ping, gpsData, msgParts)
  }

  /****************************************
  RECEIVING ALARM
  *****************************************/
  private receiveAlarm (msgParts: ParsedMsg): boolean {
    // We pass the message parts to the adapter and they have to say with type of alarm it is.
    const alarmData: ParseAlarm = <ParseAlarm>msgParts.data

    if (!alarmData) {
      // Something bad happened
      this.doLog("GPS Alarm Data can't be parsed. Discarding packet...\r\n")
      return false
    }
    /* Alarm data must return an object with at least:
    alarm_type: object with this format:
    {'code':'sos_alarm','msg':'SOS Alarm activated by the driver'}
    */
    this.doLog(
      `${alarmData.terminalInfo.alarmType} alarm received. Battery is ${alarmData.voltageLevel}. GSM with ${alarmData.gpsSignal}.`
    )
    this.emit(Control.alert, msgParts)
  }

  /****************************************
  RECEIVING HEARTBEAT
  *****************************************/
  private receiveHeartbeat (msgParts: ParsedMsg): boolean {
    const heart: ParseStatus = <ParseStatus>msgParts.data

    if (!heart) {
      // Something bad happened
      this.doLog("Heartbeat Data can't be parsed. Discarding packet...\r\n")
      return false
    }
    this.emit(Control.heartbeat, msgParts)
  }

  private runOther (cmd: string, msgParts: ParsedMsg): void {
    console.log(cmd, msgParts)
  }

  /* adding methods to the adapter */
  private getDevice (): typeof Device {
    return Device
  }

  private send (msg: Buffer | string): void {
    this.emit('Send data', msg)
    const data = f.bufferToHexString(msg)
    this.doLog(`Sending to ${this.getUID()}: ${data}\r\n`)
    this.connection.write(msg, (err) => {
      if (err) console.log('Error sending: ', err)
    })
  }

  private doLog (msg: string): void {
    this.server.doLog(msg, this.getUID())
  }

  /****************************************
  SOME SETTERS & GETTERS
  ****************************************/
  private getName (): string | boolean {
    return this.name
  }

  private setName (name: string) {
    this.name = name
  }

  private getUID (): number {
    return this.uid
  }

  private setUID (uid: number) {
    this.uid = uid
  }
}
