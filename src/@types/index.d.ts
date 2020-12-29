import Device from '../lib/device'

declare module 'net' {
    export interface Socket {
        device: Device
    }
}

declare module 'express' {
    export interface Request {
        IsRoot: boolean,
        userAuth: string | Record<string>
    }
}
