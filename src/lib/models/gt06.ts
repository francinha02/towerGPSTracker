/* eslint-disable no-unused-vars */
export interface Parts {
  start: string;
  length: number;
  protocolID: string;
  data: string;
  deviceID: string;
  gsm: number;
  power: number;
  cmd: string;
  action: string;
  count: string;
  finish: string;
}

export interface Event {
  number: number;
  string: string;
}

export interface CourseStatus {
  realTimeGps: boolean,
  gpsPositioned: boolean,
  eastLongitude: boolean,
  northLatitude: boolean,
  course: number
}

export interface TerminalInformation {
  status: boolean;
  gpsTracking: boolean;
  alarmType: string;
  charging: boolean;
  ignition: boolean;
  relayState: boolean;
}

export interface ParseLogin {
  imei: number;
  serialNumber: number;
}

export interface ParseLocation {
  fixTime: string | Date;
  satCnt: number;
  satCntActive: number;
  lat: number;
  lon: number;
  speed: number;
  speedUnit: string;
  orientation: CourseStatus;
  mcc: number;
  mnc: number;
  lac: number;
  cellId: number;
  serialNr: number;
  errorCheck: number;
}

export interface ParseAlarm {
  fixTime: string | Date;
  satCnt: number;
  satCntActive: number;
  lat: number;
  lon: number;
  speed: number;
  speedUnit: string;
  orientation: CourseStatus;
  mmc: number;
  cellId: number;
  terminalInfo: TerminalInformation;
  voltageLevel: string;
  gpsSignal: string;
  alarmLang: number;
  serialNr: number;
  errorCheck: number;
}

export interface ParseStatus {
  terminalInfo: TerminalInformation;
  voltageLevel: string;
  gsmSigStrength: string;
}

export interface ParsedMsg {
  expectsResponse: boolean;
  deviceID: number;
  parseTime: number;
  event: string;
  responseMsg: Buffer;
  cmd: string;
  action: string;
  data: string | ParseLogin | ParseLocation | ParseStatus | ParseAlarm;
}

export interface LanguagePack {
  formerBit: string;
  latterBit: string;
}

export interface Heartbeat {
  deviceInfo: TerminalInformation;
  power: string;
  gsm: string;
  alarmLang: LanguagePack;
}

export enum Control {
  loginRequest = 'loginRequest',
  ping = 'ping',
  noop = 'noop',
  clock = 'clock',
  heartbeat = 'heartbeat',
  alert = 'alert',
  replied = 'replied',
}
