export default class CellTower {
  private radioType: string;
  private cellId: number;
  private locationAreaCode: number;
  private mobileCountryCode: number;
  private mobileNetworkCode: number;
  private signalStrength: number;

  public static from (
    mcc: number,
    mnc: number,
    lac: number,
    cid: number,
    rssi?: number
  ): CellTower {
    const cellTower = new CellTower()
    cellTower.setMobileCountryCode(mcc)
    cellTower.setMobileNetworkCode(mnc)
    cellTower.setLocationAreaCode(lac)
    cellTower.setCellId(cid)
    if (rssi) cellTower.setSignalStrength(rssi)

    return cellTower
  }

  public static fromLacCid (lac: number, cid: number): CellTower {
    return CellTower.from(null, null, lac, cid)
  }

  public static fromCidLac (cid: number, lac: number): CellTower {
    return CellTower.fromLacCid(lac, cid)
  }

  public getRadioType (): string {
    return this.radioType
  }

  public setRadioType (radioType: string): void {
    this.radioType = radioType
  }

  public getCellId (): number {
    return this.cellId
  }

  public setCellId (cellId: number): void {
    this.cellId = cellId
  }

  public getLocationAreaCode (): number {
    return this.locationAreaCode
  }

  public setLocationAreaCode (locationAreaCode: number): void {
    this.locationAreaCode = locationAreaCode
  }

  public getMobileCountryCode (): number {
    return this.mobileCountryCode
  }

  public setMobileCountryCode (mobileCountryCode: number): void {
    this.mobileCountryCode = mobileCountryCode
  }

  public getMobileNetworkCode (): number {
    return this.mobileNetworkCode
  }

  public setMobileNetworkCode (mobileNetworkCode: number): void {
    this.mobileNetworkCode = mobileNetworkCode
  }

  public getSignalStrength (): number {
    return this.signalStrength
  }

  public setSignalStrength (signalStrength: number): void {
    this.signalStrength = signalStrength
  }

  public setOperator (operator: number): void {
    const operatorString = operator.toString()
    this.mobileCountryCode = parseInt(operatorString.substring(0, 3))
    this.mobileNetworkCode = parseInt(operatorString.substring(3))
  }
}
