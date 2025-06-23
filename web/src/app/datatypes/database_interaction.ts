/**
 * Represents a single weather data record from the database or API.
 */
export interface WeatherData {
  /** The date and time of the record as a string (e.g., "2024-06-23T15:00:00Z"). */
  DATE_TIME: string;

  /** Unique identifier for the data entry. */
  ID: number;

  /** Temperature value in degrees Celsius. */
  temperature: number;

  /** Humidity value as a percentage. */
  humidity: number;

  /** Air pressure value in hPa (hectopascals). */
  air_pressure: number;

  /** The sensor identifier or name that recorded this data. */
  sensor: string;

  /** Rain indicator, usually 0 for no rain and 1 (or higher) for rain. */
  regen: number;
}

/**
 * Represents a collection of weather data entries indexed by a string key.
 */
export interface apiData {
  /** 
   * A mapping where keys are strings (e.g., IDs or timestamps) 
   * and values are WeatherData objects.
   */
  [key: string]: WeatherData;
}

/**
 * Represents a simplified weather data entry used in UI or reporting.
 */
export interface WeatherEntry {
  /** The date of the weather entry in string format. */
  date: string;

  /** Rain indicator value (e.g., 0 for no rain, 1 for rain). */
  regen: number;

  /** Temperature value in degrees Celsius. */
  temperature: number;

  /** Air pressure value in hPa. */
  air_pressure: number;

  /** Humidity value as a percentage. */
  humidity: number;
}

/**
 * Represents detailed weather statistics data including date and time.
 */
export interface statsData {
  /** The date of the record in string format. */
  date: string;

  /** The time of the record in string format. */
  time: string;

  /** Temperature value in degrees Celsius. */
  temperature: number;

  /** Humidity value as a percentage. */
  humidity: number;

  /** Air pressure value in hPa. */
  air_pressure: number;

  /** Rain indicator value (0 = no rain, 1 = rain). */
  regen: number;
}
