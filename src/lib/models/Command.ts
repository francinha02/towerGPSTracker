import Message from './Message'

class Command extends Message {
  public static TYPE_CUSTOM = 'custom';
  public static TYPE_IDENTIFICATION = 'deviceIdentification';
  public static TYPE_POSITION_SINGLE = 'positionSingle';
  public static TYPE_POSITION_PERIODIC = 'positionPeriodic';
  public static TYPE_POSITION_STOP = 'positionStop';
  public static TYPE_ENGINE_STOP = 'engineStop';
  public static TYPE_ENGINE_RESUME = 'engineResume';
  public static TYPE_ALARM_ARM = 'alarmArm';
  public static TYPE_ALARM_DISARM = 'alarmDisarm';
  public static TYPE_ALARM_DISMISS = 'alarmDismiss';
  public static TYPE_SET_TIMEZONE = 'setTimezone';
  public static TYPE_REQUEST_PHOTO = 'requestPhoto';
  public static TYPE_POWER_OFF = 'powerOff';
  public static TYPE_REBOOT_DEVICE = 'rebootDevice';
  public static TYPE_SEND_SMS = 'sendSms';
  public static TYPE_SEND_USSD = 'sendUssd';
  public static TYPE_SOS_NUMBER = 'sosNumber';
  public static TYPE_SILENCE_TIME = 'silenceTime';
  public static TYPE_SET_PHONEBOOK = 'setPhonebook';
  public static TYPE_MESSAGE = 'message';
  public static TYPE_VOICE_MESSAGE = 'voiceMessage';
  public static TYPE_OUTPUT_CONTROL = 'outputControl';
  public static TYPE_VOICE_MONITORING = 'voiceMonitoring';
  public static TYPE_SET_AGPS = 'setAgps';
  public static TYPE_SET_INDICATOR = 'setIndicator';
  public static TYPE_CONFIGURATION = 'configuration';
  public static TYPE_GET_VERSION = 'getVersion';
  public static TYPE_FIRMWARE_UPDATE = 'firmwareUpdate';
  public static TYPE_SET_CONNECTION = 'setConnection';
  public static TYPE_SET_ODOMETER = 'setOdometer';
  public static TYPE_GET_MODEM_STATUS = 'getModemStatus';
  public static TYPE_GET_DEVICE_STATUS = 'getDeviceStatus';

  public static TYPE_MODE_POWER_SAVING = 'modePowerSaving';
  public static TYPE_MODE_DEEP_SLEEP = 'modeDeepSleep';

  public static TYPE_ALARM_GEOFENCE = 'movementAlarm';
  public static TYPE_ALARM_BATTERY = 'alarmBattery';
  public static TYPE_ALARM_SOS = 'alarmSos';
  public static TYPE_ALARM_REMOVE = 'alarmRemove';
  public static TYPE_ALARM_CLOCK = 'alarmClock';
  public static TYPE_ALARM_SPEED = 'alarmSpeed';
  public static TYPE_ALARM_FALL = 'alarmFall';
  public static TYPE_ALARM_VIBRATION = 'alarmVibration';

  public static KEY_UNIQUE_ID = 'uniqueId';
  public static KEY_FREQUENCY = 'frequency';
  public static KEY_LANGUAGE = 'language';
  public static KEY_TIMEZONE = 'timezone';
  public static KEY_DEVICE_PASSWORD = 'devicePassword';
  public static KEY_RADIUS = 'radius';
  public static KEY_MESSAGE = 'message';
  public static KEY_ENABLE = 'enable';
  public static KEY_DATA = 'data';
  public static KEY_INDEX = 'index';
  public static KEY_PHONE = 'phone';
  public static KEY_SERVER = 'server';
  public static KEY_PORT = 'port';

  private textChannel: boolean;
  private description: string;

  public getTextChannel (): boolean {
    return this.textChannel
  }

  public setTextChannel (textChannel: boolean): void {
    this.textChannel = textChannel
  }

  public getDeviceId (): number {
    return super.getDeviceId()
  }

  public getDescription (): string {
    return this.description
  }

  public setDescription (description: string): void {
    this.description = description
  }
}

export default Command
