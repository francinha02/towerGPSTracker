import ConfigKey from './ConfigKey'
import ConfigSuffix from './ConfigSuffix'
import { KeyType } from './KeyType'

export default class Keys {
  /**
   * Network interface for a the protocol. If not specified, server will bind all interfaces.
   */
  public static PROTOCOL_ADDRESS: ConfigSuffix<string> = new ConfigSuffix<string>(
    '.address',
    [KeyType.GLOBAL]);

  /**
   * Port number for the protocol. Most protocols use TCP on the transport layer. Some protocols use UDP. Some
   * support both TCP and UDP.
   */
  public static PROTOCOL_PORT: ConfigSuffix<number> = new ConfigSuffix<number>(
    '.port',
    [KeyType.GLOBAL]);

  /**
   * Connection timeout value in seconds. Because sometimes there is no way to detect lost TCP connection old
   * connections stay in open state. On most systems there is a limit on number of open connection, so this leads to
   * problems with establishing new connections when number of devices is high or devices data connections are
   * unstable.
   */
  public static PROTOCOL_TIMEOUT: ConfigSuffix<number> = new ConfigSuffix<number>(
    '.timeout',
    [KeyType.GLOBAL]);

  /**
   * Device password. Commonly used in some protocol for sending commands.
   */
  public static PROTOCOL_DEVICE_PASSWORD: ConfigSuffix<string> = new ConfigSuffix<string>(
    '.devicePassword',
    [KeyType.GLOBAL]);

  /**
   * Default protocol mask to use. Currently used only by Skypatrol protocol.
   */
  public static PROTOCOL_MASK: ConfigSuffix<number> = new ConfigSuffix<number>(
    '.mask',
    [KeyType.GLOBAL]);

  /**
   * Custom message length. Currently used only by H2 protocol for specifying binary message length.
   */
  public static PROTOCOL_MESSAGE_LENGTH: ConfigSuffix<number> = new ConfigSuffix<number>(
    '.messageLength',
    [KeyType.GLOBAL]);

  /**
   * Enable extended functionality for the protocol. The reason it's disabled by default is that not all devices
   * support it.
   */
  public static PROTOCOL_EXTENDED: ConfigSuffix<boolean> = new ConfigSuffix<boolean>(
    '.extended',
    [KeyType.GLOBAL]);

  /**
   * Decode string as UTF8 instead of ASCII. Only applicable for some protocols.
   */
  public static PROTOCOL_UTF8: ConfigSuffix<boolean> = new ConfigSuffix<boolean>(
    '.utf8',
    [KeyType.GLOBAL]);

  /**
   * Enable CAN decoding for the protocol. Similar to 'extended' configuration, it's not supported for some devices.
   */
  public static PROTOCOL_CAN: ConfigSuffix<boolean> = new ConfigSuffix<boolean>(
    '.can',
    [KeyType.GLOBAL]);

  /**
   * Indicates whether server acknowledgement is required. Only applicable for some protocols.
   */
  public static PROTOCOL_ACK: ConfigSuffix<boolean> = new ConfigSuffix<boolean>(
    '.ack',
    [KeyType.GLOBAL]);

  /**
   * Ignore device reported fix time. Useful in case some devices report invalid time. Currently only available for
   * GL200 protocol.
   */
  public static PROTOCOL_IGNORE_FIX_TIME: ConfigSuffix<boolean> = new ConfigSuffix<boolean>(
    '.ignoreFixTime',
    [KeyType.GLOBAL]);

  /**
   * Decode additional TK103 attributes. Not supported for some devices.
   */
  public static PROTOCOL_DECODE_LOW: ConfigSuffix<boolean> = new ConfigSuffix<boolean>(
    '.decodeLow',
    [KeyType.GLOBAL]);

  /**
   * Use long date format for Atrack protocol.
   */
  public static PROTOCOL_LONG_DATE: ConfigSuffix<boolean> = new ConfigSuffix<boolean>(
    '.longDate',
    [KeyType.GLOBAL]);

  /**
   * Use decimal fuel value format for Atrack protocol.
   */
  public static PROTOCOL_DECIMAL_FUEL: ConfigSuffix<boolean> = new ConfigSuffix<boolean>(
    '.decimalFuel',
    [KeyType.GLOBAL]);

  /**
   * Indicates additional custom attributes for Atrack protocol.
   */
  public static PROTOCOL_CUSTOM: ConfigSuffix<boolean> = new ConfigSuffix<boolean>(
    '.custom',
    [KeyType.GLOBAL]);

  /**
   * Custom format string for Atrack protocol.
   */
  public static PROTOCOL_FORM: ConfigSuffix<string> = new ConfigSuffix<string>(
    '.form',
    [KeyType.GLOBAL]);

  /**
   * Protocol configuration. Required for some devices for decoding incoming data.
   */
  public static PROTOCOL_CONFIG: ConfigSuffix<string> = new ConfigSuffix<string>(
    '.config',
    [KeyType.GLOBAL]);

  /**
   * Alarm mapping for Atrack protocol.
   */
  public static PROTOCOL_ALARM_MAP: ConfigSuffix<string> = new ConfigSuffix<string>(
    '.alarmMap',
    [KeyType.GLOBAL]);

  /**
   * Some devices require server address confirmation. Use this parameter to configure correct public address.
   */
  public static PROTOCOL_SERVER: ConfigSuffix<string> = new ConfigSuffix<string>(
    '.server',
    [KeyType.GLOBAL]);

  /**
   * Skip device connection session cache. Per protocol configuration.
   */
  public static PROTOCOL_IGNORE_SESSIONS_CACHE: ConfigSuffix<boolean> = new ConfigSuffix<boolean>(
    '.ignoreSessionCache',
    [KeyType.GLOBAL]);

  /**
   * Skip device connection session cache. Global configuration.
   */
  public static DECODER_IGNORE_SESSIONS_CACHE: ConfigKey<boolean> = new ConfigKey<boolean>(
    'decoder.ignoreSessionCache',
    [KeyType.GLOBAL]);

  /**
   * Server wide connection timeout value in seconds. See protocol timeout for more information.
   */
  public static SERVER_TIMEOUT: ConfigKey<number> = new ConfigKey<number>(
    'server.timeout',
    [KeyType.GLOBAL]);

  /**
   * Address for uploading aggregated anonymous usage statistics. Uploaded information is the same you can see on the
   * statistics screen in the web app. It does not include any sensitive (e.g. locations).
   */
  public static SERVER_STATISTICS: ConfigKey<string> = new ConfigKey<string>(
    'server.statistics',
    [KeyType.GLOBAL]);

  /**
   * If true, the event is generated once at the beginning of overspeeding period.
   */
  public static EVENT_OVERSPEED_NOT_REPEAT: ConfigKey<boolean> = new ConfigKey<boolean>(
    'event.overspeed.notRepeat',
    [KeyType.GLOBAL]);

  /**
   * Minimal over speed duration to trigger the event. Value in seconds.
   */
  public static EVENT_OVERSPEED_MINIMAL_DURATION: ConfigKey<number> = new ConfigKey<number>(
    'event.overspeed.minimalDuration',
    [KeyType.GLOBAL]);

  /**
   * Relevant only for geofence speed limits. Use lowest speed limits from all geofences.
   */
  public static EVENT_OVERSPEED_PREFER_LOWEST: ConfigKey<boolean> = new ConfigKey<boolean>(
    'event.overspeed.preferLowest',
    [KeyType.GLOBAL]);

  /**
   * Do not generate alert event if same alert was present in last known location.
   */
  public static EVENT_IGNORE_DUPLICATE_ALERTS: ConfigKey<boolean> = new ConfigKey<boolean>(
    'event.ignoreDuplicateAlerts',
    [KeyType.GLOBAL]);

  /**
   * If set to true, invalid positions will be considered for motion logic.
   */
  public static EVENT_MOTION_PROCESS_INVALID_POSITIONS: ConfigKey<boolean> = new ConfigKey<boolean>(
    'event.motion.processInvalidPositions',
    [KeyType.GLOBAL]);

  /**
   * If the speed is above specified value, the object is considered to be in motion. Default value is 0.01 knots.
   */
  public static EVENT_MOTION_SPEED_THRESHOLD: ConfigKey<number> = new ConfigKey<number>(
    'event.motion.speedThreshold',
    [KeyType.GLOBAL],
    0.01);

  /**
   * Global polyline geofence distance. Within that distance from the polyline, point is considered within the
   * geofence. Each individual geofence can also has 'polylineDistance' attribute which will take precedence.
   */
  public static GEOFENCE_POLYLINE_DISTANCE: ConfigKey<number> = new ConfigKey<number>(
    'geofence.polylineDistance',
    [KeyType.GLOBAL],
    25.0);

  /**
   * Path to the database driver JAR file. Traccar includes drivers for MySQL, PostgreSQL and H2 databases. If you use
   * one of those, you don't need to specify this parameter.
   */
  public static DATABASE_DRIVER_FILE: ConfigKey<string> = new ConfigKey<string>(
    'database.driverFile',
    [KeyType.GLOBAL]);

  /**
   * Database driver Java class. For H2 use 'org.h2.Driver'. MySQL driver class name is 'com.mysql.jdbc.Driver'.
   */
  public static DATABASE_DRIVER: ConfigKey<string> = new ConfigKey<string>(
    'database.driver',
    [KeyType.GLOBAL]);

  /**
   * Database connection URL. By default Traccar uses H2 database.
   */
  public static DATABASE_URL: ConfigKey<string> = new ConfigKey<string>(
    'database.url',
    [KeyType.GLOBAL]);

  /**
   * Database user name. Default administrator user for H2 database is 'sa'.
   */
  public static DATABASE_USER: ConfigKey<string> = new ConfigKey<string>(
    'database.user',
    [KeyType.GLOBAL]);

  /**
   * Database user password. Default password for H2 admin (sa) user is empty.
   */
  public static DATABASE_PASSWORD: ConfigKey<string> = new ConfigKey<string>(
    'database.password',
    [KeyType.GLOBAL]);

  /**
   * Path to Liquibase master changelog file.
   */
  public static DATABASE_CHANGELOG: ConfigKey<string> = new ConfigKey<string>(
    'database.changelog',
    [KeyType.GLOBAL]);

  /**
   * Automatically generate SQL database queries when possible.
   */
  public static DATABASE_GENERATE_QUERIES: ConfigKey<boolean> = new ConfigKey<boolean>(
    'database.generateQueries',
    [KeyType.GLOBAL]);

  /**
   * Database connection pool size. Default value is defined by the HikariCP library.
   */
  public static DATABASE_MAX_POOL_SIZE: ConfigKey<number> = new ConfigKey<number>(
    'database.maxPoolSize',
    [KeyType.GLOBAL]);

  /**
   * SQL query to check connection status. Default value is 'SELECT 1'. For Oracle database you can use
   * 'SELECT 1 FROM DUAL'.
   */
  public static DATABASE_CHECK_CONNECTION: ConfigKey<string> = new ConfigKey<string>(
    'database.checkConnection',
    [KeyType.GLOBAL],
    'SELECT 1');

  /**
   * Store original HEX or string data as "raw" attribute in the corresponding position.
   */
  public static DATABASE_SAVE_ORIGINAL: ConfigKey<boolean> = new ConfigKey<boolean>(
    'database.saveOriginal',
    [KeyType.GLOBAL]);

  /**
   * By default server syncs with the database if it encounters and unknown device. This flag allows to disable that
   * behavior to improve performance in some cases.
   */
  public static DATABASE_IGNORE_UNKNOWN: ConfigKey<boolean> = new ConfigKey<boolean>(
    'database.ignoreUnknown',
    [KeyType.GLOBAL]);

  /**
   * Automatically register unknown devices in the database.
   */
  public static DATABASE_REGISTER_UNKNOWN: ConfigKey<boolean> = new ConfigKey<boolean>(
    'database.registerUnknown',
    [KeyType.GLOBAL]);

  /**
   * Default category for auto-registered devices.
   */
  public static DATABASE_REGISTER_UNKNOWN_DEFAULT_CATEGORY: ConfigKey<string> = new ConfigKey<string>(
    'database.registerUnknown.defaultCategory',
    [KeyType.GLOBAL]);

  /**
   * The group id assigned to auto-registered devices.
   */
  public static DATABASE_REGISTER_UNKNOWN_DEFAULT_GROUP_ID: ConfigKey<number> = new ConfigKey<number>(
    'database.registerUnknown.defaultGroupId',
    [KeyType.GLOBAL]);

  /**
   * Minimum device refresh timeout in seconds. Default timeout is 5 minutes.
   */
  public static DATABASE_REFRESH_DELAY: ConfigKey<number> = new ConfigKey<number>(
    'database.refreshDelay',
    [KeyType.GLOBAL],
    300);

  /**
   * Store empty messages as positions. For example, heartbeats.
   */
  public static DATABASE_SAVE_EMPTY: ConfigKey<boolean> = new ConfigKey<boolean>(
    'database.saveEmpty',
    [KeyType.GLOBAL]);

  /**
   * Device limit for self registered users. Default value is -1, which indicates no limit.
   */
  public static USERS_DEFAULT_DEVICE_LIMIT: ConfigKey<number> = new ConfigKey<number>(
    'users.defaultDeviceLimit',
    [KeyType.GLOBAL],
    -1);

  /**
   * Default user expiration for self registered users. Value is in days. By default no expiration is set.
   */
  public static USERS_DEFAULT_EXPIRATION_DAYS: ConfigKey<number> = new ConfigKey<number>(
    'users.defaultExpirationDays',
    [KeyType.GLOBAL]);

  /**
   * LDAP server URL.
   */
  public static LDAP_URL: ConfigKey<string> = new ConfigKey<string>(
    'ldap.url',
    [KeyType.GLOBAL]);

  /**
   * LDAP server login.
   */
  public static LDAP_USER: ConfigKey<string> = new ConfigKey<string>(
    'ldap.user',
    [KeyType.GLOBAL]);

  /**
   * LDAP server password.
   */
  public static LDAP_PASSWORD: ConfigKey<string> = new ConfigKey<string>(
    'ldap.password',
    [KeyType.GLOBAL]);

  /**
   * Force LDAP authentication.
   */
  public static LDAP_FORCE: ConfigKey<boolean> = new ConfigKey<boolean>(
    'ldap.force',
    [KeyType.GLOBAL]);

  /**
   * LDAP user search base.
   */
  public static LDAP_BASE: ConfigKey<string> = new ConfigKey<string>(
    'ldap.base',
    [KeyType.GLOBAL]);

  /**
   * LDAP attribute used as user id. Default value is 'uid'.
   */
  public static LDAP_ID_ATTRIBUTE: ConfigKey<string> = new ConfigKey<string>(
    'ldap.idAttribute',
    [KeyType.GLOBAL],
    'uid');

  /**
   * LDAP attribute used as user name. Default value is 'cn'.
   */
  public static LDAP_NAME_ATTRIBUTE: ConfigKey<string> = new ConfigKey<string>(
    'ldap.nameAttribute',
    [KeyType.GLOBAL],
    'cn');

  /**
   * LDAP attribute used as user email. Default value is 'mail'.
   */
  public static LDAP_MAIN_ATTRIBUTE: ConfigKey<string> = new ConfigKey<string>(
    'ldap.mailAttribute',
    [KeyType.GLOBAL],
    'mail');

  /**
   * LDAP custom search filter. If not specified, '({idAttribute}=:login)' will be used as a filter.
   */
  public static LDAP_SEARCH_FILTER: ConfigKey<string> = new ConfigKey<string>(
    'ldap.searchFilter',
    [KeyType.GLOBAL]);

  /**
   * LDAP custom admin search filter.
   */
  public static LDAP_ADMIN_FILTER: ConfigKey<string> = new ConfigKey<string>(
    'ldap.adminFilter',
    [KeyType.GLOBAL]);

  /**
   * LDAP admin user group. Used if custom admin filter is not specified.
   */
  public static LDAP_ADMIN_GROUP: ConfigKey<string> = new ConfigKey<string>(
    'ldap.adminGroup',
    [KeyType.GLOBAL]);

  /**
   * If no data is reported by a device for the given amount of time, status changes from online to unknown. Value is
   * in seconds. Default timeout is 10 minutes.
   */
  public static STATUS_TIMEOUT: ConfigKey<number> = new ConfigKey<number>(
    'status.timeout',
    [KeyType.GLOBAL],
    600);

  /**
   * Force additional state check when device status changes to 'offline' or 'unknown'. Default false.
   */
  public static STATUS_UPDATE_DEVICE_STATE: ConfigKey<boolean> = new ConfigKey<boolean>(
    'status.updateDeviceState',
    [KeyType.GLOBAL]);

  /**
   * List of protocol names to ignore offline status. Can be useful to not trigger status change when devices are
   * configured to disconnect after reporting a batch of data.
   */
  public static STATUS_IGNORE_OFFLINE: ConfigKey<string> = new ConfigKey<string>(
    'status.ignoreOffline',
    [KeyType.GLOBAL]);

  /**
   * Path to the media folder. Server stores audio, video and photo files in that folder. Sub-folders will be
   * automatically created for each device by unique id.
   */
  public static MEDIA_PATH: ConfigKey<string> = new ConfigKey<string>(
    'media.path',
    [KeyType.GLOBAL]);

  /**
   * Optional parameter to specify network interface for web interface to bind to. By default server will bind to all
   * available interfaces.
   */
  public static WEB_ADDRESS: ConfigKey<string> = new ConfigKey<string>(
    'web.address',
    [KeyType.GLOBAL]);

  /**
   * Web interface TCP port number. By default Traccar uses port 8082. To avoid specifying port in the browser you
   * can set it to 80 (default HTTP port).
   */
  public static WEB_PORT: ConfigKey<number> = new ConfigKey<number>(
    'web.port',
    [KeyType.GLOBAL]);

  /**
   * Path to the web app folder.
   */
  public static WEB_PATH: ConfigKey<string> = new ConfigKey<string>(
    'web.path',
    [KeyType.GLOBAL]);

  /**
   * WebSocket connection timeout in milliseconds. Default timeout is 10 minutes.
   */
  public static WEB_TIMEOUT: ConfigKey<number> = new ConfigKey<number>(
    'web.timeout',
    [KeyType.GLOBAL],
    60000);

  /**
   * Authentication sessions timeout in seconds. By default no timeout.
   */
  public static WEB_SESSION_TIMEOUT: ConfigKey<number> = new ConfigKey<number>(
    'web.sessionTimeout',
    [KeyType.GLOBAL]);

  /**
   * Enable database access console via '/console' URL. Use only for debugging. Never use in production.
   */
  public static WEB_CONSOLE: ConfigKey<boolean> = new ConfigKey<boolean>(
    'web.console',
    [KeyType.GLOBAL]);

  /**
   * Server debug version of the web app. Not recommended to use for performance reasons. It is intended to be used
   * for development and debugging purposes.
   */
  public static WEB_DEBUG: ConfigKey<boolean> = new ConfigKey<boolean>(
    'web.debug',
    [KeyType.GLOBAL]);

  /**
   * Cross-origin resource sharing origin header value.
   */
  public static WEB_ORIGIN: ConfigKey<string> = new ConfigKey<string>(
    'web.origin',
    [KeyType.GLOBAL]);

  /**
   * Cache control header value. By default resources are cached for one hour.
   */
  public static WEB_CACHE_CONTROL: ConfigKey<string> = new ConfigKey<string>(
    'web.cacheControl',
    [KeyType.GLOBAL],
    'max-age=3600,public');

  /**
   * URL to forward positions. Data is passed through URL parameters. For example, {uniqueId} for device identifier,
   * {latitude} and {longitude} for coordinates.
   */
  public static FORWARD_URL: ConfigKey<string> = new ConfigKey<string>(
    'forward.url',
    [KeyType.GLOBAL]);

  /**
   * Additional HTTP header, can be used for authorization.
   */
  public static FORWARD_HEADER: ConfigKey<string> = new ConfigKey<string>(
    'forward.header',
    [KeyType.GLOBAL]);

  /**
   * Boolean value to enable forwarding in JSON format.
   */
  public static FORWARD_JSON: ConfigKey<boolean> = new ConfigKey<boolean>(
    'forward.json',
    [KeyType.GLOBAL]);

  /**
   * Boolean value to enable URL parameters in json mode. For example, {uniqueId} for device identifier,
   * {latitude} and {longitude} for coordinates.
   */
  public static FORWARD_URL_VARIABLES: ConfigKey<boolean> = new ConfigKey<boolean>(
    'forward.urlVariables',
    [KeyType.GLOBAL]);

  /**
   * Position forwarding retrying enable. When enabled, additional attempts are made to deliver positions. If initial
   * delivery fails, because of an unreachable server or an HTTP response different from '2xx', the software waits
   * for 'forward.retry.delay' milliseconds to retry delivery. On subsequent failures, this delay is duplicated.
   * If forwarding is retried for 'forward.retry.count', retrying is canceled and the position is dropped. Positions
   * pending to be delivered are limited to 'forward.retry.limit'. If this limit is reached, positions get discarded.
   */
  public static FORWARD_RETRY_ENABLE: ConfigKey<boolean> = new ConfigKey<boolean>(
    'forward.retry.enable',
    [KeyType.GLOBAL]);

  /**
   * Position forwarding retry first delay in milliseconds.
   * Can be set to anything greater than 0. Defaults to 100 milliseconds.
   */
  public static FORWARD_RETRY_DELAY: ConfigKey<number> = new ConfigKey<number>(
    'forward.retry.delay',
    [KeyType.GLOBAL]);

  /**
   * Position forwarding retry maximum retries.
   * Can be set to anything greater than 0. Defaults to 10 retries.
   */
  public static FORWARD_RETRY_COUNT: ConfigKey<number> = new ConfigKey<number>(
    'forward.retry.count',
    [KeyType.GLOBAL]);

  /**
   * Position forwarding retry pending positions limit.
   * Can be set to anything greater than 0. Defaults to 100 positions.
   */
  public static FORWARD_RETRY_LIMIT: ConfigKey<number> = new ConfigKey<number>(
    'forward.retry.limit',
    [KeyType.GLOBAL]);

  /**
   * Events forwarding URL.
   */
  public static EVENT_FORWARD_URL: ConfigKey<string> = new ConfigKey<string>(
    'event.forward.url',
    [KeyType.GLOBAL]);

  /**
   * Events forwarding headers. Example value:
   * FirstHeader: hello
   * SecondHeader: world
   */
  public static EVENT_FORWARD_HEADERS: ConfigKey<string> = new ConfigKey<string>(
    'event.forward.header',
    [KeyType.GLOBAL]);

  /**
   * Enable commands queuing when devices are offline. Commands are buffered in memory only, so restarting service
   * will clear the buffer.
   */
  public static COMMANDS_QUEUEING: ConfigKey<boolean> = new ConfigKey<boolean>(
    'commands.queueing',
    [KeyType.GLOBAL]);

  /**
   * SMS API service full URL. Enables SMS commands and notifications.
   */
  public static SMS_HTTP_URL: ConfigKey<string> = new ConfigKey<string>(
    'sms.http.url',
    [KeyType.GLOBAL]);

  /**
   * SMS API authorization header name. Default value is 'Authorization'.
   */
  public static SMS_HTTP_AUTHORIZATION_HEADER: ConfigKey<string> = new ConfigKey<string>(
    'sms.http.authorizationHeader',
    [KeyType.GLOBAL],
    'Authorization');

  /**
   * SMS API authorization header value. This value takes precedence over user and password.
   */
  public static SMS_HTTP_AUTHORIZATION: ConfigKey<string> = new ConfigKey<string>(
    'sms.http.authorization',
    [KeyType.GLOBAL]);

  /**
   * SMS API basic authentication user.
   */
  public static SMS_HTTP_USER: ConfigKey<string> = new ConfigKey<string>(
    'sms.http.user',
    [KeyType.GLOBAL]);

  /**
   * SMS API basic authentication password.
   */
  public static SMS_HTTP_PASSWORD: ConfigKey<string> = new ConfigKey<string>(
    'sms.http.password',
    [KeyType.GLOBAL]);

  /**
   * SMS API body template. Placeholders {phone} and {message} can be used in the template.
   * If value starts with '{' or '[', server automatically assumes JSON format.
   */
  public static SMS_HTTP_TEMPLATE: ConfigKey<string> = new ConfigKey<string>(
    'sms.http.template',
    [KeyType.GLOBAL]);

  /**
   * Traccar notification API key.
   */
  public static NOTIFICATOR_TRACCAR_KEY: ConfigKey<string> = new ConfigKey<string>(
    'notificator.traccar.key',
    [KeyType.GLOBAL]);

  /**
   * Firebase server API key for push notifications.
   */
  public static NOTIFICATOR_FIREBASE_KEY: ConfigKey<string> = new ConfigKey<string>(
    'notificator.firebase.key',
    [KeyType.GLOBAL]);

  /**
   * Pushover notification user name.
   */
  public static NOTIFICATOR_PUSHOVER_USER: ConfigKey<string> = new ConfigKey<string>(
    'notificator.pushover.user',
    [KeyType.GLOBAL]);

  /**
   * Pushover notification user token.
   */
  public static NOTIFICATOR_PUSHOVER_TOKEN: ConfigKey<string> = new ConfigKey<string>(
    'notificator.pushover.token',
    [KeyType.GLOBAL]);

  /**
   * Telegram notification API key.
   */
  public static NOTIFICATOR_TELEGRAM_KEY: ConfigKey<string> = new ConfigKey<string>(
    'notificator.telegram.key',
    [KeyType.GLOBAL]);

  /**
   * Telegram notification chat id to post messages to.
   */
  public static NOTIFICATOR_TELEGRAM_CHAT_ID: ConfigKey<string> = new ConfigKey<string>(
    'notificator.telegram.chatId',
    [KeyType.GLOBAL]);

  /**
   * Maximum time period for reports in seconds. Can be useful to prevent users to request unreasonably long reports.
   * By default there is no limit.
   */
  public static REPORT_PERIOD_LIMIT: ConfigKey<number> = new ConfigKey<number>(
    'report.periodLimit',
    [KeyType.GLOBAL]);

  /**
   * Trips less than minimal duration and minimal distance are ignored. 300 seconds and 500 meters are default.
   */
  public static REPORT_TRIP_MINIMAL_TRIP_DISTANCE: ConfigKey<number> = new ConfigKey<number>(
    'report.trip.minimalTripDistance',
    [KeyType.GLOBAL],
    500);

  /**
   * Trips less than minimal duration and minimal distance are ignored. 300 seconds and 500 meters are default.
   */
  public static REPORT_TRIP_MINIMAL_TRIP_DURATION: ConfigKey<number> = new ConfigKey<number>(
    'report.trip.minimalTripDuration',
    [KeyType.GLOBAL],
    300);

  /**
   * Parking less than minimal duration does not cut trip. Default 300 seconds.
   */
  public static REPORT_TRIP_MINIMAL_PARKING_DURATION: ConfigKey<number> = new ConfigKey<number>(
    'report.trip.minimalParkingDuration',
    [KeyType.GLOBAL],
    300);

  /**
   * Gaps of more than specified time are counted as stops. Default value is one hour.
   */
  public static REPORT_TRIP_MINIMAL_NO_DATA_DURATION: ConfigKey<number> = new ConfigKey<number>(
    'report.trip.minimalNoDataDuration',
    [KeyType.GLOBAL],
    3600);

  /**
   * Flag to enable ignition use for trips calculation.
   */
  public static REPORT_TRIP_USE_IGNITION: ConfigKey<boolean> = new ConfigKey<boolean>(
    'report.trip.useIgnition',
    [KeyType.GLOBAL]);

  /**
   * Boolean flag to enable or disable position filtering.
   */
  public static FILTER_ENABLE: ConfigKey<boolean> = new ConfigKey<boolean>(
    'filter.enable',
    [KeyType.GLOBAL]);

  /**
   * Filter invalid (valid field is set to false) positions.
   */
  public static FILTER_INVALID: ConfigKey<boolean> = new ConfigKey<boolean>(
    'filter.invalid',
    [KeyType.GLOBAL]);

  /**
   * Filter zero coordinates. Zero latitude and longitude are theoretically valid values, but it practice it usually
   * indicates invalid GPS data.
   */
  public static FILTER_ZERO: ConfigKey<boolean> = new ConfigKey<boolean>(
    'filter.zero',
    [KeyType.GLOBAL]);

  /**
   * Filter duplicate records (duplicates are detected by time value).
   */
  public static FILTER_DUPLICATE: ConfigKey<boolean> = new ConfigKey<boolean>(
    'filter.duplicate',
    [KeyType.GLOBAL]);

  /**
   * Filter records with fix time in future. The values is specified in seconds. Records that have fix time more than
   * specified number of seconds later than current server time would be filtered out.
   */
  public static FILTER_FUTURE: ConfigKey<number> = new ConfigKey<number>(
    'filter.future',
    [KeyType.GLOBAL]);

  /**
   * Filter positions with accuracy less than specified value in meters.
   */
  public static FILTER_ACCURACY: ConfigKey<number> = new ConfigKey<number>(
    'filter.accuracy',
    [KeyType.GLOBAL]);

  /**
   * Filter cell and wifi locations that are coming from geolocation provider.
   */
  public static FILTER_APPROXIMATE: ConfigKey<boolean> = new ConfigKey<boolean>(
    'filter.approximate',
    [KeyType.GLOBAL]);

  /**
   * Filter positions with exactly zero speed values.
   */
  public static FILTER_STATIC: ConfigKey<boolean> = new ConfigKey<boolean>(
    'filter.static',
    [KeyType.GLOBAL]);

  /**
   * Filter records by distance. The values is specified in meters. If the new position is less far than this value
   * from the last one it gets filtered out.
   */
  public static FILTER_DISTANCE: ConfigKey<number> = new ConfigKey<number>(
    'filter.distance',
    [KeyType.GLOBAL]);

  /**
   * Filter records by Maximum Speed value in knots. Can be used to filter jumps to far locations even if they're
   * marked as valid. Shouldn't be too low. Start testing with values at about 25000.
   */
  public static FILTER_MAX_SPEED: ConfigKey<number> = new ConfigKey<number>(
    'filter.maxSpeed',
    [KeyType.GLOBAL]);

  /**
   * Filter position if time from previous position is less than specified value in seconds.
   */
  public static FILTER_MIN_PERIOD: ConfigKey<number> = new ConfigKey<number>(
    'filter.minPeriod',
    [KeyType.GLOBAL]);

  /**
   * Time limit for the filtering in seconds. If the time difference between last position and a new one is more than
   * this limit, the new position will not be filtered out.
   */
  public static FILTER_SKIP_LIMIT: ConfigKey<number> = new ConfigKey<number>(
    'filter.skipLimit',
    [KeyType.GLOBAL]);

  /**
   * Enable attributes skipping. Attribute skipping can be enabled in the config or device attributes.
   */
  public static FILTER_SKIP_ATTRIBUTES_ENABLE: ConfigKey<boolean> = new ConfigKey<boolean>(
    'filter.skipAttributes.enable',
    [KeyType.GLOBAL]);

  /**
   * Override device time. Possible values are 'deviceTime' and 'serverTime'
   */
  public static TIME_OVERRIDE: ConfigKey<string> = new ConfigKey<string>(
    'time.override',
    [KeyType.GLOBAL]);

  /**
   * List of protocols for overriding time. If not specified override is applied globally. List consist of protocol
   * names that can be separated by comma or single space character.
   */
  public static TIME_PROTOCOLS: ConfigKey<string> = new ConfigKey<string>(
    'time.protocols',
    [KeyType.GLOBAL]);

  /**
   * Replaces coordinates with last known if change is less than a 'coordinates.minError' meters
   * or more than a 'coordinates.maxError' meters. Helps to avoid coordinates jumps during parking period
   * or jumps to zero coordinates.
   */
  public static COORDINATES_FILTER: ConfigKey<boolean> = new ConfigKey<boolean>(
    'coordinates.filter',
    [KeyType.GLOBAL]);

  /**
   * Distance in meters. Distances below this value gets handled like explained in 'coordinates.filter'.
   */
  public static COORDINATES_MIN_ERROR: ConfigKey<number> = new ConfigKey<number>(
    'coordinates.minError',
    [KeyType.GLOBAL]);

  /**
   * Distance in meters. Distances above this value gets handled like explained in 'coordinates.filter', but only if
   * Position is also marked as 'invalid'.
   */
  public static COORDINATES_MAX_ERROR: ConfigKey<number> = new ConfigKey<number>(
    'coordinates.maxError',
    [KeyType.GLOBAL]);

  /**
   * Enable to save device IP addresses information. Disabled by default.
   */
  public static PROCESSING_REMOTE_ADDRESS_ENABLE: ConfigKey<boolean> = new ConfigKey<boolean>(
    'processing.remoteAddress.enable',
    [KeyType.GLOBAL]);

  /**
   * Enable engine hours calculation on the server side. It uses ignition value to determine engine state.
   */
  public static PROCESSING_ENGINE_HOURS_ENABLE: ConfigKey<boolean> = new ConfigKey<boolean>(
    'processing.engineHours.enable',
    [KeyType.GLOBAL]);

  /**
   * Enable copying of missing attributes from last position to the current one. Might be useful if device doesn't
   * send some values in every message.
   */
  public static PROCESSING_COPY_ATTRIBUTES_ENABLE: ConfigKey<boolean> = new ConfigKey<boolean>(
    'processing.copyAttributes.enable',
    [KeyType.GLOBAL]);

  /**
   * Enable computed attributes processing.
   */
  public static PROCESSING_COMPUTED_ATTRIBUTES_ENABLE: ConfigKey<boolean> = new ConfigKey<boolean>(
    'processing.computedAttributes.enable',
    [KeyType.GLOBAL]);

  /**
   * Enable computed attributes processing.
   */
  public static PROCESSING_COMPUTED_ATTRIBUTES_DEVICE_ATTRIBUTES: ConfigKey<boolean> = new ConfigKey<boolean>(
    'processing.computedAttributes.deviceAttributes',
    [KeyType.GLOBAL]);

  /**
   * Boolean flag to enable or disable reverse geocoder.
   */
  public static GEOCODER_ENABLE: ConfigKey<boolean> = new ConfigKey<boolean>(
    'geocoder.enable',
    [KeyType.GLOBAL]);

  /**
   * Reverse geocoder type. Check reverse geocoding documentation for more info. By default (if the value is not
   * specified) server uses Google API.
   */
  public static GEOCODER_TYPE: ConfigKey<string> = new ConfigKey<string>(
    'geocoder.type',
    [KeyType.GLOBAL]);

  /**
   * Geocoder server URL. Applicable only to Nominatim and Gisgraphy providers.
   */
  public static GEOCODER_URL: ConfigKey<string> = new ConfigKey<string>(
    'geocoder.url',
    [KeyType.GLOBAL]);

  /**
   * App id for use with Here provider.
   */
  public static GEOCODER_ID: ConfigKey<string> = new ConfigKey<string>(
    'geocoder.id',
    [KeyType.GLOBAL]);

  /**
   * Provider API key. Most providers require API keys.
   */
  public static GEOCODER_KEY: ConfigKey<string> = new ConfigKey<string>(
    'geocoder.key',
    [KeyType.GLOBAL]);

  /**
   * Language parameter for providers that support localization (e.g. Google and Nominatim).
   */
  public static GEOCODER_LANGUAGE: ConfigKey<string> = new ConfigKey<string>(
    'geocoder.language',
    [KeyType.GLOBAL]);

  /**
   * Address format string. Default value is %h %r, %t, %s, %c. See AddressFormat for more info.
   */
  public static GEOCODER_FORMAT: ConfigKey<string> = new ConfigKey<string>(
    'geocoder.format',
    [KeyType.GLOBAL]);

  /**
   * Cache size for geocoding results.
   */
  public static GEOCODER_CACHE_SIZE: ConfigKey<number> = new ConfigKey<number>(
    'geocoder.cacheSize',
    [KeyType.GLOBAL]);

  /**
   * Disable automatic reverse geocoding requests for all positions.
   */
  public static GEOCODER_IGNORE_POSITIONS: ConfigKey<boolean> = new ConfigKey<boolean>(
    'geocoder.ignorePositions',
    [KeyType.GLOBAL]);

  /**
   * Boolean flag to apply reverse geocoding to invalid positions.
   */
  public static GEOCODER_PROCESS_INVALID_POSITIONS: ConfigKey<boolean> = new ConfigKey<boolean>(
    'geocoder.processInvalidPositions',
    [KeyType.GLOBAL]);

  /**
   * Optional parameter to specify minimum distance for new reverse geocoding request. If distance is less than
   * specified value (in meters), then Traccar will reuse last known address.
   */
  public static GEOCODER_REUSE_DISTANCE: ConfigKey<number> = new ConfigKey<number>(
    'geocoder.reuseDistance',
    [KeyType.GLOBAL]);

  /**
   * Perform geocoding when preparing reports and sending notifications.
   */
  public static GEOCODER_ON_REQUEST: ConfigKey<boolean> = new ConfigKey<boolean>(
    'geocoder.onRequest',
    [KeyType.GLOBAL]);

  /**
   * Boolean flag to enable LBS location resolution. Some devices send cell towers information and WiFi point when GPS
   * location is not available. Traccar can determine coordinates based on that information using third party
   * services. Default value is false.
   */
  public static GEOLOCATION_ENABLE: ConfigKey<boolean> = new ConfigKey<boolean>(
    'geolocation.enable',
    [KeyType.GLOBAL]);

  /**
   * Provider to use for LBS location. Available options: google, mozilla and opencellid. By default opencellid is
   * used. You have to supply a key that you get from corresponding provider. For more information see LBS geolocation
   * documentation.
   */
  public static GEOLOCATION_TYPE: ConfigKey<string> = new ConfigKey<string>(
    'geolocation.type',
    [KeyType.GLOBAL]);

  /**
   * Geolocation provider API URL address. Not required for most providers.
   */
  public static GEOLOCATION_URL: ConfigKey<string> = new ConfigKey<string>(
    'geolocation.url',
    [KeyType.GLOBAL]);

  /**
   * Provider API key. OpenCellID service requires API key.
   */
  public static GEOLOCATION_KEY: ConfigKey<string> = new ConfigKey<string>(
    'geolocation.key',
    [KeyType.GLOBAL]);

  /**
   * Boolean flag to apply geolocation to invalid positions.
   */
  public static GEOLOCATION_PROCESS_INVALID_POSITIONS: ConfigKey<boolean> = new ConfigKey<boolean>(
    'geolocation.processInvalidPositions',
    [KeyType.GLOBAL]);

  /**
   * Default MCC value to use if device doesn't report MCC.
   */
  public static GEOLOCATION_MCC: ConfigKey<number> = new ConfigKey<number>(
    'geolocation.mcc',
    [KeyType.GLOBAL]);

  /**
   * Default MNC value to use if device doesn't report MNC.
   */
  public static GEOLOCATION_MNC: ConfigKey<number> = new ConfigKey<number>(
    'geolocation.mnc',
    [KeyType.GLOBAL]);

  /**
   * Boolean flag to enable speed limit API to get speed limit values depending on location. Default value is false.
   */
  public static SPEED_LIMIT_ENABLE: ConfigKey<boolean> = new ConfigKey<boolean>(
    'speedLimit.enable',
    [KeyType.GLOBAL]);

  /**
   * Provider to use for speed limit. Available options: overpass. By default overpass is used.
   */
  public static SPEED_LIMIT_TYPE: ConfigKey<string> = new ConfigKey<string>(
    'speedLimit.type',
    [KeyType.GLOBAL]);

  /**
   * Speed limit provider API URL address.
   */
  public static SPEED_LIMIT_URL: ConfigKey<string> = new ConfigKey<string>(
    'speedLimit.url',
    [KeyType.GLOBAL]);

  /**
   * Override latitude sign / hemisphere. Useful in cases where value is incorrect because of device bug. Value can be
   * N for North or S for South.
   */
  public static LOCATION_LATITUDE_HEMISPHERE: ConfigKey<string> = new ConfigKey<string>(
    'location.latitudeHemisphere',
    [KeyType.GLOBAL]);

  /**
   * Override longitude sign / hemisphere. Useful in cases where value is incorrect because of device bug. Value can
   * be E for East or W for West.
   */
  public static LOCATION_LONGITUDE_HEMISPHERE: ConfigKey<string> = new ConfigKey<string>(
    'location.longitudeHemisphere',
    [KeyType.GLOBAL]);

  /**
   * Enable Jetty Request Log.
   */
  public static WEB_REQUEST_LOG_ENABLE: ConfigKey<boolean> = new ConfigKey<boolean>(
    'web.requestLog.enable',
    [KeyType.GLOBAL]);

  /**
   * Jetty Request Log Path.
   * The path must include the string "yyyy_mm_dd", which is replaced with the actual date when creating and rolling
   * over the file.
   * Example: ./logs/jetty-yyyy_mm_dd.request.log
   */
  public static WEB_REQUEST_LOG_PATH: ConfigKey<string> = new ConfigKey<string>(
    'web.requestLog.path',
    [KeyType.GLOBAL]);

  /**
   * Set the number of days before rotated request log files are deleted.
   */
  public static WEB_REQUEST_LOG_RETAIN_DAYS: ConfigKey<number> = new ConfigKey<number>(
    'web.requestLog.retainDays',
    [KeyType.GLOBAL]);

  /**
   * Disable systemd health checks.
   */
  public static WEB_DISABLE_HEALTH_CHECK: ConfigKey<boolean> = new ConfigKey<boolean>(
    'web.disableHealthCheck',
    [KeyType.GLOBAL]);

  /**
   * Sets SameSite cookie attribute value.
   * Supported options: Lax, Strict, None.
   */
  public static WEB_SAME_SITE_COOKIE: ConfigKey<string> = new ConfigKey<string>(
    'web.sameSiteCookie',
    [KeyType.GLOBAL]);

  /**
   * Output logging to the standard terminal output instead of a log file.
   */
  public static LOGGER_CONSOLE: ConfigKey<boolean> = new ConfigKey<boolean>(
    'logger.console',
    [KeyType.GLOBAL]);

  /**
   * Log file name. For rotating logs, a date is added at the end of the file name for non-current logs.
   */
  public static LOGGER_FILE: ConfigKey<string> = new ConfigKey<string>(
    'logger.file',
    [KeyType.GLOBAL]);

  /**
   * Logging level. Default value is 'info'.
   * Available options: off, severe, warning, info, config, fine, finer, finest, all.
   */
  public static LOGGER_LEVEL: ConfigKey<string> = new ConfigKey<string>(
    'logger.level',
    [KeyType.GLOBAL]);

  /**
   * Print full exception traces. Useful for debugging. By default shortened traces are logged.
   */
  public static LOGGER_FULL_STACK_TRACES: ConfigKey<boolean> = new ConfigKey<boolean>(
    'logger.fullStackTraces',
    [KeyType.GLOBAL]);

  /**
   * Create a new log file daily. Helps with log management. For example, downloading and cleaning logs. Enabled by
   * default.
   */
  public static LOGGER_ROTATE: ConfigKey<boolean> = new ConfigKey<boolean>(
    'logger.rotate',
    [KeyType.GLOBAL]);

  /**
   * A list of position attributes to log.
   */
  public static LOGGER_ATTRIBUTES: ConfigKey<string> = new ConfigKey<string>(
    'logger.attributes',
    [KeyType.GLOBAL],
    'time,position,speed,course,accuracy,result');
}
