import { Adapter } from '../lib/adapters/gt06'
import { Control } from '../lib/models/gt06'

const adapter = new Adapter()

test('Login Request', () => {
  const buffer = Buffer.from('78780d010866968030810130000f4cf90d0a', 'hex')
  const parsed = adapter.parseData(buffer)

  const data = {
    expectsResponse: true,
    deviceID: 866968030810130,
    parseTime: parsed.parseTime,
    event: { number: 1, string: 'login' },
    data: { imei: 866968030810130, serialNumber: 15 },
    responseMsg: Buffer.from('787805010001d9dc0d0a', 'hex'),
    action: Control.loginRequest,
    cmd: Control.loginRequest
  }
  expect(parsed).toMatchObject(data)
})

test('Heartbeat', () => {
  const buffer = Buffer.from('78780a13460604000200108b670d0a', 'hex')
  const parsed = adapter.parseData(buffer)

  const data = {
    expectsResponse: true,
    deviceID: null,
    parseTime: parsed.parseTime,
    event: { number: 19, string: 'status' },
    data: {
      terminalInfo: {
        status: false,
        gpsTracking: true,
        alarmType: 'normal',
        charging: true,
        ignition: true,
        relayState: false
      },
      voltageLevel: 'very high',
      gsmSigStrength: 'strong signal'
    },
    responseMsg: Buffer.from('787805130002db6a0d0a', 'hex'),
    action: Control.heartbeat,
    cmd: Control.heartbeat
  }
  expect(parsed).toMatchObject(data)
})
