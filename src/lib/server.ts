import { EventEmitter } from 'events'
import fs from 'fs/promises'
import { Server as S, Socket, createServer } from 'net'
import path from 'path'

import Device from './device'
import { AdapterTypes } from './models/adapter'
import { Options } from './models/server'

export default class Server extends EventEmitter {
  private opts: Options;
  private callback: { (device: Device, connection: Socket): void }
  private devices: Socket[];
  private device: Device;
  private server: S;
  private debug: boolean;
  private availableAdapters: { GT06?: string; SUNTECH?: string };
  private deviceAdapter: AdapterTypes;
  private defaults: Options =
    {
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
    this.availableAdapters = {
      GT06: './adapters/gt06',
      SUNTECH: './adapters/suntech'
    }

    this.init(() => {
      this.server = createServer((connection: Socket) => {
        const adapter = this.getAdapter()
        // We create an new device and give the an adapter to parse the incoming messages
        connection.device = new Device(adapter, connection, this)
        this.device = connection.device
        this.devices.push(connection)

        // Once we receive data...
        connection.on('data', (data) => {
          this.device.emit('data', data)
        })

        // Remove the device from the list when it leaves
        connection.on('end', () => {
          this.devices.splice(this.devices.indexOf(connection), 1)
          this.device.emit('disconnected')
        })

        connection.on('error', (e) => {
          this.device.emit('warning', e)
        })

        this.callback(connection.device, connection)

        this.device.emit('connected')
      })
    })

    this.server.listen(this.opts.port, process.env.HOST)
  }

  //! SOME FUNCTIONS
  setAdapter (adapter: AdapterTypes): void {
    if (typeof adapter.Adapter !== 'function') {
      throw new Error(
        'The adapter needs an Adapter() method to start an instance of it'
      )
    }
    this.deviceAdapter = adapter
  }

  getAdapter (): AdapterTypes {
    return this.deviceAdapter
  }

  addAdapter (name: string, value: string): void {
    Object.defineProperty(this.availableAdapters, name, {
      value: value,
      enumerable: true
    })
  }

  private init (callback: { (): void; (): void }): void {
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
      // const adapterFile: string = this.availableAdapters[op.deviceAdapter]

      const adapterFile = this.availableAdapters[this.opts.deviceAdapter]

      import(adapterFile)
        .then((adapter) => {
          // const adapter: Adapter = new adapter.Adapter(this.device)
          this.setAdapter(adapter)
        })
        .catch((err) => console.log(err))
    }

    this.emit('before_init')
    if (typeof callback === 'function') callback()
    this.emit('init')

    // FINAL INIT MESSAGE
    console.log(
        `\nGPS LISTENER running at port ${this.opts.port} EXPECTING DEVICE MODEL: ${this.opts.deviceAdapter}`
    )
  }

  doLog (msg: string | Uint8Array, from?: string | number): boolean {
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
