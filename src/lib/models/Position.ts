import { DateTime } from 'luxon'

import Message from './Message'
import Network from './Network'

export default class Position extends Message {
  public static KEY_ORIGINAL = 'raw';
  public static KEY_INDEX = 'index';
  public static KEY_HDOP = 'hdop';
  public static KEY_VDOP = 'vdop';
  public static KEY_PDOP = 'pdop';
  public static KEY_SATELLITES = 'sat'; // in use
  public static KEY_SATELLITES_VISIBLE = 'satVisible';
  public static KEY_RSSI = 'rssi';
  public static KEY_GPS = 'gps';
  public static KEY_ROAMING = 'roaming';
  public static KEY_EVENT = 'event';
  public static KEY_ALARM = 'alarm';
  public static KEY_STATUS = 'status';
  public static KEY_ODOMETER = 'odometer'; // meters
  public static KEY_ODOMETER_SERVICE = 'serviceOdometer'; // meters
  public static KEY_ODOMETER_TRIP = 'tripOdometer'; // meters
  public static KEY_HOURS = 'hours';
  public static KEY_STEPS = 'steps';
  public static KEY_HEART_RATE = 'heartRate';
  public static KEY_INPUT = 'input';
  public static KEY_OUTPUT = 'output';
  public static KEY_IMAGE = 'image';
  public static KEY_VIDEO = 'video';
  public static KEY_AUDIO = 'audio';

  // The units for the below four KEYs currently vary.
  // The preferred units of measure are specified in the comment for each.
  public static KEY_POWER = 'power'; // volts
  public static KEY_BATTERY = 'battery'; // volts
  public static KEY_BATTERY_LEVEL = 'batteryLevel'; // percentage
  public static KEY_FUEL_LEVEL = 'fuel'; // liters
  public static KEY_FUEL_USED = 'fuelUsed'; // liters
  public static KEY_FUEL_CONSUMPTION = 'fuelConsumption'; // liters/hour

  public static KEY_VERSION_FW = 'versionFw';
  public static KEY_VERSION_HW = 'versionHw';
  public static KEY_TYPE = 'type';
  public static KEY_IGNITION = 'ignition';
  public static KEY_FLAGS = 'flags';
  public static KEY_ANTENNA = 'antenna';
  public static KEY_CHARGE = 'charge';
  public static KEY_IP = 'ip';
  public static KEY_ARCHIVE = 'archive';
  public static KEY_DISTANCE = 'distance'; // meters
  public static KEY_TOTAL_DISTANCE = 'totalDistance'; // meters
  public static KEY_RPM = 'rpm';
  public static KEY_VIN = 'vin';
  public static KEY_APPROXIMATE = 'approximate';
  public static KEY_THROTTLE = 'throttle';
  public static KEY_MOTION = 'motion';
  public static KEY_ARMED = 'armed';
  public static KEY_GEOFENCE = 'geofence';
  public static KEY_ACCELERATION = 'acceleration';
  public static KEY_DEVICE_TEMP = 'deviceTemp'; // celsius
  public static KEY_COOLANT_TEMP = 'coolantTemp'; // celsius
  public static KEY_ENGINE_LOAD = 'engineLoad';
  public static KEY_OPERATOR = 'operator';
  public static KEY_COMMAND = 'command';
  public static KEY_BLOCKED = 'blocked';
  public static KEY_DOOR = 'door';
  public static KEY_AXLE_WEIGHT = 'axleWeight';
  public static KEY_G_SENSOR = 'gSensor';
  public static KEY_ICCID = 'iccid';
  public static KEY_PHONE = 'phone';
  public static KEY_SPEED_LIMIT = 'speedLimit';

  public static KEY_DTCS = 'dtcs';
  public static KEY_OBD_SPEED = 'obdSpeed'; // knots
  public static KEY_OBD_ODOMETER = 'obdOdometer'; // meters

  public static KEY_RESULT = 'result';

  public static KEY_DRIVER_UNIQUE_ID = 'driverUniqueId';

  // Start with 1 not 0
  public static PREFIX_TEMP = 'temp';
  public static PREFIX_ADC = 'adc';
  public static PREFIX_IO = 'io';
  public static PREFIX_COUNT = 'count';
  public static PREFIX_IN = 'in';
  public static PREFIX_OUT = 'out';

  public static ALARM_GENERAL = 'general';
  public static ALARM_SOS = 'sos';
  public static ALARM_VIBRATION = 'vibration';
  public static ALARM_MOVEMENT = 'movement';
  public static ALARM_LOW_SPEED = 'lowspeed';
  public static ALARM_OVERSPEED = 'overspeed';
  public static ALARM_FALL_DOWN = 'fallDown';
  public static ALARM_LOW_POWER = 'lowPower';
  public static ALARM_LOW_BATTERY = 'lowBattery';
  public static ALARM_FAULT = 'fault';
  public static ALARM_POWER_OFF = 'powerOff';
  public static ALARM_POWER_ON = 'powerOn';
  public static ALARM_DOOR = 'door';
  public static ALARM_LOCK = 'lock';
  public static ALARM_UNLOCK = 'unlock';
  public static ALARM_GEOFENCE = 'geofence';
  public static ALARM_GEOFENCE_ENTER = 'geofenceEnter';
  public static ALARM_GEOFENCE_EXIT = 'geofenceExit';
  public static ALARM_GPS_ANTENNA_CUT = 'gpsAntennaCut';
  public static ALARM_ACCIDENT = 'accident';
  public static ALARM_TOW = 'tow';
  public static ALARM_IDLE = 'idle';
  public static ALARM_HIGH_RPM = 'highRpm';
  public static ALARM_ACCELERATION = 'hardAcceleration';
  public static ALARM_BRAKING = 'hardBraking';
  public static ALARM_CORNERING = 'hardCornering';
  public static ALARM_LANE_CHANGE = 'laneChange';
  public static ALARM_FATIGUE_DRIVING = 'fatigueDriving';
  public static ALARM_POWER_CUT = 'powerCut';
  public static ALARM_POWER_RESTORED = 'powerRestored';
  public static ALARM_JAMMING = 'jamming';
  public static ALARM_TEMPERATURE = 'temperature';
  public static ALARM_PARKING = 'parking';
  public static ALARM_SHOCK = 'shock';
  public static ALARM_BONNET = 'bonnet';
  public static ALARM_FOOT_BRAKE = 'footBrake';
  public static ALARM_FUEL_LEAK = 'fuelLeak';
  public static ALARM_TAMPERING = 'tampering';
  public static ALARM_REMOVING = 'removing';

  private protocol: string;
  private serverTime: Date;
  private deviceTime: Date;
  private fixTime: Date;
  private outdated: boolean;
  private valid: boolean;
  private latitude: number;
  private longitude: number;
  private altitude: number; // value in meters
  private speed: number; // value in knots
  private course: number;
  private address: string;
  private accuracy: number;
  private network: Network;

  constructor (protocol?: string) {
    super()
    if (protocol) {
      this.protocol = protocol
    }
    this.serverTime = DateTime.local().toJSDate()
    console.log(DateTime.local().toJSDate())
  }

  public getProtocol (): string {
    return this.protocol
  }

  public setProtocol (protocol: string): void {
    this.protocol = protocol
  }

  public getServerTime (): Date {
    return this.serverTime
  }

  public setServerTime (serverTime: Date): void {
    this.serverTime = serverTime
  }

  public getDeviceTime (): Date {
    return this.deviceTime
  }

  public setDeviceTime (deviceTime: Date): void {
    this.deviceTime = deviceTime
  }

  public getFixTime (): Date {
    return this.fixTime
  }

  public setFixTime (fixTime: Date): void {
    this.fixTime = fixTime
  }

  public setTime (time: Date): void {
    this.setDeviceTime(time)
    this.setFixTime(time)
  }

  public getOutdated (): boolean {
    return this.outdated
  }

  public setOutdated (outdated: boolean): void {
    this.outdated = outdated
  }

  public getValid (): boolean {
    return this.valid
  }

  public setValid (valid: boolean): void {
    this.valid = valid
  }

  public getLatitude (): number {
    return this.latitude
  }

  public setLatitude (latitude: number): void {
    this.latitude = latitude
  }

  public getLongitude (): number {
    return this.longitude
  }

  public setLongitude (longitude: number): void {
    this.longitude = longitude
  }

  public getAltitude (): number {
    return this.altitude
  }

  public setAltitude (altitude: number): void {
    this.altitude = altitude
  }

  public getSpeed (): number {
    return this.speed
  }

  public setSpeed (speed: number): void {
    this.speed = speed
  }

  public getCourse (): number {
    return this.course
  }

  public setCourse (course: number): void {
    this.course = course
  }

  public getAddress (): string {
    return this.address
  }

  public setAddress (address: string): void {
    this.address = address
  }

  public getAccuracy (): number {
    return this.accuracy
  }

  public setAccuracy (accuracy: number): void {
    this.accuracy = accuracy
  }

  public getNetwork (): Network {
    return this.network
  }

  public setNetwork (network: Network): void {
    this.network = network
  }

  public getType (): string {
    return super.getType()
  }
}
