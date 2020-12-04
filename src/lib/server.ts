import { EventEmitter } from 'events'
import net from 'net'
import fs from 'fs/promises'
import path from 'path'
import Device from './device'
import { Options } from './models/server'
import { Adapter, modelName } from './adapters/gt06'

export default class Server extends EventEmitter {
  private opts: Options
  private callback
  private devices: any[]
  private device: Device
  private server: net.Server
  private debug: boolean
  private availableAdapters: object
  private deviceAdapter: Adapter
  private defaults: Options = {
    debug: false,
    port: 2790,
    deviceAdapter: false
  }

  constructor (opts: Options, callback: { (device: Device, connection: net.Socket): void }) {
    super()
    this.opts = opts
    this.callback = callback

    this.opts = Object.assign(this.defaults, opts)
    this.devices = []
    this.availableAdapters = { GT02D: './adapters/gt02d' }

    this.init(() => {
      this.server = net.createServer((connection: net.Socket) => {
        const adapter = this.getAdapter()
        // We create an new device and give the an adapter to parse the incoming messages
        const device = new Device(adapter, connection, this)
        this.device = device
        this.devices.push(connection)

        // Once we receive data...
        connection.on('data', (data) => {
          device.emit('data', data)
        })

        // Remove the device from the list when it leaves
        connection.on('end', () => {
          this.devices.splice(this.devices.indexOf(connection), 1)
          device.emit('disconnected')
        })

        callback(device, connection)

        device.emit('connected')
      }).listen(opts.port, '201.39.69.70')
    })
  }

  //! SOME FUNCTIONS
  setAdapter (adapter: Adapter) {
    // if (typeof adapter !== 'function') {
    //   throw new Error('The adapter needs an Adapter() method to start an instance of it')
    // }
    this.deviceAdapter = adapter
  }

  getAdapter () {
    return this.deviceAdapter
  }

  addAdapter (name: string, value: string) {
    Object.defineProperty(this.availableAdapters, name, {
      value: value,
      enumerable: true
    })
  }

  async init (callback) {
    // Set debug
    this.setDebug(this.opts.debug)

    //! DEVICE ADAPTER INITIALIZATION
    if (!this.opts.deviceAdapter) {
      console.error('The app don\'t set the deviceAdapter to use. Which model is sending data to this server?')
    }

    if (typeof this.opts.deviceAdapter === 'string') {
      // Verifica se o modelo selecionado tem um adaptador disponível.
      if (typeof this.availableAdapters[this.opts.deviceAdapter] === 'undefined' || this.availableAdapters[this.opts.deviceAdapter] === null) {
        this.doLog(`The class adapter for ${this.opts.deviceAdapter} doesn't exist or is null\r\n`)
      }

      // Pega o valor do arquivo do adaptador
      // const adapterFile: string = this.availableAdapters[this.opts.deviceAdapter]

      const adapter = new Adapter(this.device)

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
    console.log(`\nGPS LISTENER running at port ${this.opts.port} EXPECTING DEVICE MODEL: ${modelName}`)
  }

  doLog (msg: string | Uint8Array, from?: string) {
    // If debug is disabled, return false
    if (this.getDebug() === false) return false

    // If from parameter is not set, default is server.
    if (!from) from = 'SERVER'

    msg = `#${from}: ${msg}`
    fs.writeFile(path.resolve(__dirname, '..', 'log', `${from}.txt`), msg, { flag: 'a', encoding: 'utf8' })
  }

  // SOME SETTERS & GETTERS
  setDebug (val: boolean) {
    this.debug = (val === true)
  }

  getDebug () {
    return this.debug
  }

  findDevice (deviceID) {
    for (const i in this.devices) {
      const dev = this.devices[i].device
      if (dev.uid === deviceID) {
        return dev
      }
    }
  }
}
