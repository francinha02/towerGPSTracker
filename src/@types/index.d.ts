import Device from '../lib/device'

declare module 'net' {
    export interface Socket {
        device: Device
    }
}
