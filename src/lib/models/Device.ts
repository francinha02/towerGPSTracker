import GroupedModel from './GroupModel'

class Device extends GroupedModel {
  private name: string;
  private uniqueId: string;
  private status: string;
  private lastUpdate: Date;
  private positionId: number;
  private geofenceIds: Array<number>;
  private phone: string;
  private model: string;
  private contact: string;
  private category: string;
  private disabled: boolean;
  public static STATUS_UNKNOWN = 'unknown';
  public static STATUS_ONLINE = 'online';
  public static STATUS_OFFLINE = 'offline';

  public getName (): string {
    return this.name
  }

  public setName (name: string): void {
    this.name = name
  }

  public getUniqueId (): string {
    return this.uniqueId
  }

  public setUniqueId (uniqueId: string): void {
    this.uniqueId = uniqueId
  }

  public getStatus (): string {
    return this.status ? this.status : Device.STATUS_OFFLINE
  }

  public setStatus (status: string): void {
    this.status = status
  }

  public getLastUpdate (): Date {
    if (this.lastUpdate) {
      return new Date(this.lastUpdate.getTime())
    } else {
      return null
    }
  }

  public setLastUpdate (lastUpdate: Date): void {
    if (lastUpdate) {
      this.lastUpdate = new Date(lastUpdate.getTime())
    } else {
      this.lastUpdate = null
    }
  }

  public getPositionId (): number {
    return this.positionId
  }

  public setPositionId (positionId: number): void {
    this.positionId = positionId
  }

  public getGeofenceIds (): Array<number> {
    return this.geofenceIds
  }

  public setGeofenceIds (geofenceIds: Array<number>): void {
    this.geofenceIds = geofenceIds
  }

  public getPhone (): string {
    return this.phone
  }

  public setPhone (phone: string): void {
    this.phone = phone
  }

  public getModel (): string {
    return this.model
  }

  public setModel (model: string): void {
    this.model = model
  }

  public getContact (): string {
    return this.contact
  }

  public setContact (contact: string): void {
    this.contact = contact
  }

  public getCategory (): string {
    return this.category
  }

  public setCategory (category: string): void {
    this.category = category
  }

  public getDisabled (): boolean {
    return this.disabled
  }

  public setDisabled (disabled: boolean): void {
    this.disabled = disabled
  }
}

export default Device
