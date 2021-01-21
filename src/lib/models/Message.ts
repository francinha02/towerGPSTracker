import { ExtendedModel } from './ExtendedModel'

export class Message extends ExtendedModel {
  private deviceId: number
  private type: string

  public getDeviceId (): number {
    return this.deviceId
  }

  public setDeviceId (deviceId: number): void {
    this.deviceId = deviceId
  }

  public getType (): string {
    return this.type
  }

  public setType (type: string): void {
    this.type = type
  }
}
