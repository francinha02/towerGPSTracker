export default class WifiAccessPoint {
  private macAddress: string;
  private signalStrength: number;
  private channel: number;

  public static from (
    macAddress: string,
    signalStrength: number,
    channel: number
  ): WifiAccessPoint {
    const wifiAccessPoint = new WifiAccessPoint()
    wifiAccessPoint.setMacAddress(macAddress)
    wifiAccessPoint.setSignalStrength(signalStrength)
    wifiAccessPoint.setChannel(channel)
    return wifiAccessPoint
  }

  public getMacAddress (): string {
    return this.macAddress
  }

  public setMacAddress (macAddress: string): void {
    this.macAddress = macAddress
  }

  public getSignalStrength (): number {
    return this.signalStrength
  }

  public setSignalStrength (signalStrength: number): void {
    this.signalStrength = signalStrength
  }

  public getChannel (): number {
    return this.channel
  }

  public setChannel (channel: number): void {
    this.channel = channel
  }
}
