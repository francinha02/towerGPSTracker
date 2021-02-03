import Device from '../lib/device'
import { UserAuth } from '../models/user'

declare module 'net' {
    export interface Socket {
        device: Device
    }
}

declare module 'express' {
    export interface Request {
        role: string,
        userAuth: UserAuth
    }
}
