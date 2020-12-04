const { DateTime } = require('luxon')

const dexToDegrees = (dex) => {
  return parseInt(dex, 16) / 1800000
}

const getCourseStatus = (courseStatus) => {
  const result = {
    realTime: parseInt(courseStatus.substr(2, 1)),
    positioned: parseInt(courseStatus.substr(3, 1)),
    longitudePosition: parseInt(courseStatus.substr(4, 1)),
    latitudePosition: parseInt(courseStatus.substr(5, 1)),
    course: parseInt(courseStatus.substr(6, 10), 2)
  }
  return result
}

const parseDateTime = (data, locale) => {
  const str = data

  const year = parseInt(str.substr(0, 2), 16) + 2000
  const month = strPad((parseInt(str.substr(2, 2), 16)).toString(), 2, '0')
  const day = strPad(parseInt(str.substr(4, 2), 16).toString(), 2, '0')
  const hour = strPad(parseInt(str.substr(6, 2), 16).toString(), 2, '0')
  const minutes = strPad(parseInt(str.substr(8, 2), 16).toString(), 2, '0')
  const seconds = strPad(parseInt(str.substr(10, 2), 16).toString(), 2, '0')

  let d = DateTime.fromISO(`${year}-${month}-${day}T${hour}:${minutes}:${seconds}`, { zone: 'Asia/Shanghai' })
  if (locale) {
    d = d.setZone(locale)
  }

  return d.toString()
}

const getDeviceInfo = (info) => {
  console.log(info)
  const data = {
    connected: info.substr(0, 1),
    gpsTracking: info.substr(1, 1),
    alarm: info.substr(2, 3),
    charge: info.substr(5, 1),
    acc: info.substr(6, 1),
    activated: info.substr(7, 1)
  }

  switch (data.alarm) {
    case '100':
      data.alarm = 'SOS'
      break
    case '011':
      data.alarm = 'Low Battery'
      break
    case '010':
      data.alarm = 'Power Cut'
      break
    case '001':
      data.alarm = 'Shock'
      break
    case '000':
      data.alarm = 'Normal'
      break
  }

  return data
}

const getAlarmLanguage = (formerBit, latterBit) => {
  const data = {
    formerBit: '',
    latterBit: ''
  }
  switch (formerBit) {
    case '00':
      data.formerBit = 'Normal'
      break
    case '01':
      data.formerBit = 'SOS'
      break
    case '02':
      data.formerBit = 'Power Cut'
      break
    case '03':
      data.formerBit = 'Shock'
      break
    case '04':
      data.formerBit = 'Fence In'
      break
    case '05':
      data.formerBit = 'Fence Out'
      break
  }

  switch (latterBit) {
    case '01':
      data.latterBit = 'Chinese'
      break
    case '02':
      data.latterBit = 'English'
      break
  }

  return data
}

const receiveAlarm = (msgParts) => {
  const str = msgParts

  const data = {
    dateTime: parseDateTime(str, 'America/Sao_Paulo'),
    setCount: str.substr(12, 2), // Length of GPS information, quantity of positioning satellites
    latitudeRaw: str.substr(14, 8),
    longitudeRaw: str.substr(22, 8),
    latitude: dexToDegrees(str.substr(14, 8)),
    longitude: dexToDegrees(str.substr(22, 8)),
    speed: parseInt(str.substr(30, 2), 16),
    orientation: getCourseStatus(strPad(parseInt(str.substr(32, 4), 16).toString(2), 8, '0')),
    lbs: str.substr(36, 18),
    deviceInfo: getDeviceInfo(strPad(parseInt(str.substr(54, 2), 16).toString(2), 8, '0')),
    power: str.substr(56, 2),
    gsm: str.substr(58, 2),
    alarmLang: getAlarmLanguage(str.substr(60, 2), str.substr(62, 2))
  }

  switch (data.power) {
    case '00':
      data.power = 'No Power (shutdown)'
      break
    case '01':
      data.power = 'Extremely Low Battery'
      break
    case '02':
      data.power = 'Very Low Battery'
      break
    case '03':
      data.power = 'Low Battery'
      break
    case '04':
      data.power = 'Medium'
      break
    case '05':
      data.power = 'High'
      break
    case '06':
      data.power = 'Very High'
      break
  }

  switch (data.gsm) {
    case '00':
      data.gsm = 'No Signal'
      break
    case '01':
      data.gsm = 'Extremely Weak Signal'
      break
    case '02':
      data.gsm = 'Very Weak Signal'
      break
    case '03':
      data.gsm = 'Good Signal'
      break
    case '04':
      data.gsm = 'Strong Signal'
      break
  }

  console.log('Receive Alarm: ', data)
  return data
}

const strPad = (input, length, string) => {
  string = string || '0'
  input = input + ''
  return input.length >= length ? input : new Array(length - input.length + 1).join(string) + input
}

receiveAlarm('140c0502061ec70069fcae04214a870018b80902d40050050065ba50060402020495cedd0d0a')
