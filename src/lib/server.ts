import { EventEmitter } from 'events'
import net, { Socket } from 'net'
import fs from 'fs/promises'
import path from 'path'
import Device from './device'
import { Options } from './models/server'
import { Adapter, modelName } from './adapters/gt06'

export default class Server extends EventEmitter {
  private opts: Options;
  private callback: (device: Device, connection: net.Socket) => void;
  private devices: Socket[];
  private device: Device;
  private server: net.Server;
  private debug: boolean;
  private availableAdapters: { [x: string]: string; GT02D?: string };
  private deviceAdapter: Adapter;
  private defaults: Options = {
    debug: false,
    port: 2790,
    deviceAdapter: false
  };

  constructor (
    opts: Options,
    callback: { (device: Device, connection: Socket): void }
  ) {
    super()
    this.opts = opts
    this.callback = callback

    this.opts = Object.assign(this.defaults, opts)
    this.devices = []
    this.availableAdapters = { GT02D: './adapters/gt06' }

    this.init(() => {
      this.server = net.createServer((connection: net.Socket) => {
        const adapter = this.getAdapter()
        // We create an new device and give the an adapter to parse the incoming messages
        connection.device = new Device(adapter, connection, this)
        this.device = connection.device
        this.devices.push(connection)

        // Once we receive data...
        connection.on('data', (data) => {
          connection.device.emit('data', data)
        })

        // Remove the device from the list when it leaves
        connection.on('end', () => {
          this.devices.splice(this.devices.indexOf(connection), 1)
          connection.device.emit('disconnected')
        })

        callback(connection.device, connection)

        connection.device.emit('connected')
      })
    })
    this.server.listen(opts.port, process.env.HOST)
  }

  //! SOME FUNCTIONS
  private setAdapter (adapter: Adapter): void {
    // if (typeof adapter !== 'function') {
    //   throw new Error('The adapter needs an Adapter() method to start an instance of it')
    // }
    this.deviceAdapter = adapter
  }

  private getAdapter (): Adapter {
    return this.deviceAdapter
  }

  private addAdapter (name: string, value: string): void {
    Object.defineProperty(this.availableAdapters, name, {
      value: value,
      enumerable: true
    })
  }

  private init (callback: { (): void; (): void }) {
    // Set debug
    this.setDebug(this.opts.debug)

    //! DEVICE ADAPTER INITIALIZATION
    if (!this.opts.deviceAdapter) {
      console.error(
        "The app don't set the deviceAdapter to use. Which model is sending data to this server?"
      )
    }

    if (typeof this.opts.deviceAdapter === 'string') {
      // Verifica se o modelo selecionado tem um adaptador disponível.
      if (!this.availableAdapters[this.opts.deviceAdapter]) {
        this.doLog(
          `The class adapter for ${this.opts.deviceAdapter} doesn't exist or is null\r\n`
        )
      }

      // Pega o valor do arquivo do adaptador
      // const adapterFile: string = this.availableAdapters[this.opts.deviceAdapter]

      const adapter = new Adapter()

      this.setAdapter(adapter)
    }
    // else {
    //   // IF THE APP PASS THE ADEPTER DIRECTLY
    //   this.setAdapter(this.opts.deviceAdapter)
    // }
    this.emit('before_init')
    if (typeof callback === 'function') callback()
    this.emit('init')

    // FINAL INIT MESSAGE
    console.log(
      `\nGPS LISTENER running at port ${this.opts.port} EXPECTING DEVICE MODEL: ${modelName}`
    )
  }

  private doLog (msg: string | Uint8Array, from?: string): boolean {
    // If debug is disabled, return false
    if (this.getDebug() === false) return false

    // If from parameter is not set, default is server.
    if (!from) from = 'SERVER'

    msg = `#${from}: ${msg}`
    fs.writeFile(path.resolve(__dirname, '..', 'log', `${from}.txt`), msg, {
      flag: 'a',
      encoding: 'utf8'
    })
  }

  // SOME SETTERS & GETTERS
  setDebug (val: boolean): void {
    this.debug = val === true
  }

  private getDebug (): boolean {
    return this.debug
  }

  private findDevice (deviceID: number): Device {
    for (const i in this.devices) {
      const dev = this.devices[i].device
      if (dev.uid === deviceID) {
        return dev
      }
    }
  }

  sendTo (deviceID: number, msg: Buffer, type: boolean): void {
    const dev = this.findDevice(deviceID)
    if (!dev) {
      console.log(`Device ${deviceID} not found. Please verify information`)
      return
    }
    dev.sendCommand(msg, type)
  }
}
