export default class DeviceSession {
  private deviceId: number;
  private timeZone: string;
  constructor (deviceId: number) {
    this.deviceId = deviceId
  }

  public getDeviceId (): number {
    return this.deviceId
  }

  public setTimeZone (timeZone: string): void {
    this.timeZone = timeZone
  }

  public getTimeZone (): string {
    return this.timeZone
  }
}
