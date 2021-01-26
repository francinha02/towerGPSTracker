export default class UnitsConverter {
  private static KNOTS_TO_KPH_RATIO = 0.539957;
  private static KNOTS_TO_MPH_RATIO = 0.868976;
  private static KNOTS_TO_MPS_RATIO = 1.94384;
  private static KNOTS_TO_CPS_RATIO = 0.0194384449;
  private static METERS_TO_FEET_RATIO = 0.3048;
  private static METERS_TO_MILE_RATIO = 1609.34;
  private static MILLISECONDS_TO_HOURS_RATIO = 3600000;
  private static MILLISECONDS_TO_MINUTES_RATIO = 60000;

  public static knotsFromKph (value: number): number {
    return value * UnitsConverter.KNOTS_TO_KPH_RATIO
  }

  public static kphFromKnots (value: number): number {
    return value / UnitsConverter.KNOTS_TO_KPH_RATIO
  }

  public static knotsFromMph (value: number): number {
    return value * UnitsConverter.KNOTS_TO_MPH_RATIO
  }

  public static mphFromKnots (value: number): number {
    return value / UnitsConverter.KNOTS_TO_MPH_RATIO
  }

  public static knotsFromMps (value: number): number {
    return value * UnitsConverter.KNOTS_TO_MPS_RATIO
  }

  public static mpsFromKnots (value: number): number {
    return value / UnitsConverter.KNOTS_TO_MPS_RATIO
  }

  public static knotsFromCps (value: number): number {
    return value * UnitsConverter.KNOTS_TO_CPS_RATIO
  }

  public static feetFromMeters (value: number): number {
    return value / UnitsConverter.METERS_TO_FEET_RATIO
  }

  public static metersFromFeet (value: number): number {
    return value * UnitsConverter.METERS_TO_FEET_RATIO
  }

  public static milesFromMeters (value: number): number {
    return value / UnitsConverter.METERS_TO_MILE_RATIO
  }

  public static metersFromMiles (value: number): number {
    return value * UnitsConverter.METERS_TO_MILE_RATIO
  }

  public static msFromHours (value: number): number {
    return value * UnitsConverter.MILLISECONDS_TO_HOURS_RATIO
  }

  public static msFromMinutes (value: number): number {
    return value * UnitsConverter.MILLISECONDS_TO_MINUTES_RATIO
  }
}
