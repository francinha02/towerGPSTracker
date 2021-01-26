import CellTower from './CellTower'
import WifiAccessPoint from './WifiAccessPoint'

export default class Network {
  private homeMobileCountryCode: number;
  private homeMobileNetworkCode: number;
  private radioType: string;
  private carrier: string;
  private considerIp = false;
  private cellTowers: CellTower[];
  private wifiAccessPoints: WifiAccessPoint[];

  constructor (data?: CellTower | WifiAccessPoint) {
    this.cellTowers = []
    this.wifiAccessPoints = []
    this.radioType = 'gsm'
    if (data) {
      if (data instanceof CellTower) {
        this.addCellTower(data)
      } else if (data instanceof WifiAccessPoint) {
        this.addWifiAccessPoint(data)
      }
    }
  }

  public getHomeMobileCountryCode (): number {
    return this.homeMobileCountryCode
  }

  public setHomeMobileCountryCode (homeMobileCountryCode: number): void {
    this.homeMobileCountryCode = homeMobileCountryCode
  }

  public getHomeMobileNetworkCode (): number {
    return this.homeMobileNetworkCode
  }

  public setHomeMobileNetworkCode (homeMobileNetworkCode: number): void {
    this.homeMobileNetworkCode = homeMobileNetworkCode
  }

  public getRadioType (): string {
    return this.radioType
  }

  public setRadioType (radioType: string): void {
    this.radioType = radioType
  }

  public getCarrier (): string {
    return this.carrier
  }

  public setCarrier (carrier: string): void {
    this.carrier = carrier
  }

  public getConsiderIp (): boolean {
    return this.considerIp
  }

  public setConsiderIp (considerIp: boolean): void {
    this.considerIp = considerIp
  }

  public getCellTowers (): CellTower[] {
    return this.cellTowers
  }

  public setCellTowers (cellTowers: CellTower[]): void {
    this.cellTowers = cellTowers
  }

  public addCellTower (cellTower: CellTower): void {
    if (!this.cellTowers) {
      this.cellTowers = []
    }
    this.cellTowers.push(cellTower)
  }

  public getWifiAccessPoints (): WifiAccessPoint[] {
    return this.wifiAccessPoints
  }

  public setWifiAccessPoints (wifiAccessPoints: WifiAccessPoint[]): void {
    this.wifiAccessPoints = wifiAccessPoints
  }

  public addWifiAccessPoint (wifiAccessPoint: WifiAccessPoint): void {
    if (this.wifiAccessPoints == null) {
      this.wifiAccessPoints = []
    }
    this.wifiAccessPoints.push(wifiAccessPoint)
  }
}
