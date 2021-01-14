// import crc16 from '../functions/crc16'
// import * as f from '../functions/functions'
const compatibleHardware = ['SUNTECH/supplier']
const modelName = 'SUNTECH'
const protocol = 'SUNTECH'

class Adapter {
  private __count: number;
  private msgBufferRaw: any[];
  private msgBuffer: any[];

  constructor () {
    this.msgBufferRaw = []
    this.msgBuffer = []
    this.__count = 1
  }

  parseData (data) {
    console.log(data)
    this.msgBuffer.push(data)

    return this.msgBuffer
  }

  clearMsgBuffer (): void {
    this.msgBuffer.length = 0
  }
}

export { protocol, modelName, compatibleHardware, Adapter }
