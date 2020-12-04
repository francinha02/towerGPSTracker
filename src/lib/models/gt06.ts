/* eslint-disable no-unused-vars */
export interface Format {
  start: string,
  end: string,
  separator: string
}

export interface Parts {
  start: string,
  length: number,
  protocolID: string,
  data: string,
  deviceID: string,
  gsm: number,
  power: number,
  cmd: string,
  action: string,
  count: string,
  finish: string
}

export interface CourseStatus {
  realTime: number,
  positioned: number,
  longitudePosition: number,
  latitudePosition: number,
  course: number
}

export interface LanguagePack {
  formerBit: string,
  latterBit: string
}

export interface TerminalInformation {
  connected: string,
  gpsTracking: string,
  alarm: string,
  charge: string,
  acc: string,
  activated: string
}

export interface GPS {
  dateTime: Date | string,
  gpsInformation: string,
  latitude: number,
  longitude: number,
  speed: number,
  courseStatus: CourseStatus,
  mcc: string,
  mnc: string,
  network: string,
  lac: string,
  cellID: string
}

export interface Alarm {
  dateTime: string,
  setCount: string,
  latitudeRaw: string,
  longitudeRaw: string,
  latitude: number,
  longitude: number,
  speed: number,
  orientation: CourseStatus,
  lbs: string,
  deviceInfo: TerminalInformation,
  power: string,
  gsm: string,
  alarmLang: LanguagePack
}

export enum Control {
  loginRequest = 'loginRequest',
  ping = 'ping',
  noop = 'noop',
  clock = 'clock',
  heartbeat = 'heartbeat',
  alert = 'alert'
}

export enum Course {
  East = 0,
  West = 1,
  South = 0,
  North = 1
}
