/* eslint-disable @typescript-eslint/no-unused-vars */
import { AddressInfo, Socket } from 'net'
import { getRepository } from 'typeorm'

import { Adapter } from '../../database/entity/Adapter'
import { Protocol } from '../models/Protocol'
import DeviceSession from './DeviceSession'

export default abstract class BaseProtocolDecoder {
  private static PROTOCOL_UNKNOWN = 'unknown';
  private protocol: Protocol;
  private channelDeviceSession: DeviceSession; // connection-based protocols
  private addressDeviceSessions: Map<AddressInfo, DeviceSession>; // connection less protocols

  /**
   * getProtocolName
   */
  public getProtocolName () {
    return this.protocol
      ? this.protocol.getName()
      : BaseProtocolDecoder.PROTOCOL_UNKNOWN
  }

  /**
   * getDeviceSession
   */
  public async getDeviceSession (
    chanel: Socket,
    ...uniqueIds: number[]
  ) {
    if (chanel) {
      const device: Adapter = await this.findDevice(...uniqueIds)
      if (device) {
        return { deviceSession: new DeviceSession(device.equipmentNumber), device }
      } else {
        return null
      }
    }
  }

  /**
   * findDeviceId
   */
  public async findDevice (...uniqueIds: number[]): Promise<Adapter> {
    if (uniqueIds.length > 0) {
      let device: Adapter = null

      try {
        for (const uniqueId of uniqueIds) {
          if (uniqueId) {
            device = await getRepository(Adapter).findOne({
              where: { equipmentNumber: uniqueId }
            })
            return device
          }
        }
      } catch (e) {
        return null
      }
    }
  }
}
