import { DateTime } from 'luxon'

export default class DateBuilder {
  private calendar: DateTime

  constructor () {
    this.calendar = DateTime.fromMillis(Date.now())
  }

  public setYear (year: number): DateBuilder {
    if (year < 100) {
      year += 2000
    }
    this.calendar.set({ year })
    return this
  }

  public setMonth (month: number): DateBuilder {
    this.calendar.set({ month: month - 1 })
    return this
  }

  public setDay (day: number): DateBuilder {
    this.calendar.set({ day })
    return this
  }

  public setDate (year: number, month: number, day: number): DateBuilder {
    return this.setYear(year).setMonth(month).setDay(day)
  }

  public setDateReverse (day: number, month: number, year: number): DateBuilder {
    return this.setDate(year, month, day)
  }

  public setCurrentDate (): DateBuilder {
    const now = new Date()
    return this.setYear(now.getFullYear())
      .setMonth(now.getMonth() + 1)
      .setDay(now.getDate())
  }

  public setHour (hour: number): DateBuilder {
    this.calendar.set({ hour })
    return this
  }

  public setMinute (minute: number): DateBuilder {
    this.calendar.set({ minute })
    return this
  }

  public addMinute (minute: number): DateBuilder {
    this.calendar.plus({ minute })
    return this
  }

  public setSecond (second: number): DateBuilder {
    this.calendar.set({ second })
    return this
  }

  public addSeconds (seconds: number): DateBuilder {
    this.calendar.plus({ seconds })
    return this
  }

  public setMillis (millis: number): DateBuilder {
    this.calendar.set({ millisecond: millis })
    return this
  }

  public addMillis (millis: number): DateBuilder {
    this.calendar.plus({ milliseconds: millis })
    return this
  }

  public setTimeReverse (
    second: number,
    minute: number,
    hour: number
  ): DateBuilder {
    return this.setHour(hour).setMinute(minute).setSecond(second)
  }

  public setTime (
    hour: number,
    minute: number,
    second: number,
    millis?: number
  ): DateBuilder {
    return !millis
      ? this.setHour(hour).setMinute(minute).setSecond(second)
      : this.setHour(hour)
        .setMinute(minute)
        .setSecond(second)
        .setMillis(millis)
  }

  public getDate (): Date {
    return this.calendar.toJSDate()
  }
}
