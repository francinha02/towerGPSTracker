import { DateTime, Settings } from 'luxon'

import { TimeZone } from '../models/Timezone'

export class DateFormat {
  private timeZone: string;

  constructor () {
    Settings.defaultLocale = 'pt-Br'
  }

  /**
   * parse
   */
  public parse (date: string, time: string): Date {
    const year = parseInt(date.substring(0, 4))
    const month = date.substring(4, 6)
    const day = date.substring(6, 8)
    const hour = time.substring(0, 2)
    const minutes = time.substring(3, 5)
    const seconds = time.substring(6, 8)

    const d = DateTime.fromISO(
      `${year}-${month}-${day}T${hour}:${minutes}:${seconds}`,
      {
        zone: this.getTimezone(),
        locale: 'pt-Br'
      }
    )

    return d.toJSDate()
  }

  /**
   * setTimeZone
   */
  public setTimeZone (timeZone: string): void {
    this.timeZone = timeZone
  }

  /**
   * getTimezone
   */
  public getTimezone (): string {
    return this.timeZone
  }

  /**
   * fixTime
   */
  public fixTime (date: Date, timezone?: TimeZone): Date {
    return timezone
      ? DateTime.fromJSDate(date).plus({ hours: timezone }).toJSDate()
      : date
  }
}
