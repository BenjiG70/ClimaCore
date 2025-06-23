import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiData } from '../datatypes/database_interaction'

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  /**
   * Base URL for the API including the port.
   */
  private apiUrl = 'http://192.168.178.8:4202';
  //private apiUrl = 'http://127.0.0.1:4202';

  /**
   * Constructor to inject the HttpClient service.
   * @param http Angular HttpClient for making HTTP requests.
   */
  constructor(private http: HttpClient) {}

  /**
   * Retrieves all sensor data from the API.
   * @returns An Observable emitting all sensor data.
   */
  getAllData(): Observable<apiData> {
    return this.http.get<apiData>(`${this.apiUrl}/get/all/data`);
  }

  /**
   * Retrieves a list of all sensors from the API.
   * @returns An Observable emitting sensor information.
   */
  getSensors(): Observable<apiData> {
    return this.http.get<apiData>(`${this.apiUrl}/get/all/sensors`);
  }

  /**
   * Retrieves sensor data for a specific sensor and time range.
   * 
   * @param sensor The sensor identifier.
   * @param format The aggregation interval format: 'H' (hour), 'W' (week), 'M' (month), or 'Y' (year).
   * @param enddate The end date timestamp (milliseconds since epoch).
   * @returns An Observable emitting the sensor data within the specified range.
   */
  getSensorDataByRange(sensor: string, format: string, enddate: number): Observable<apiData> {
    const date = new Date(enddate);
    const end = date.getTime();
    let start: number;
    switch (format) {
      case 'H':
        start = date.setDate(date.getDate() - 1);
        break;
      case 'W':
        start = date.setDate(date.getDate() - 7);
        break;
      case 'M':
        start = date.setMonth(date.getMonth() - 1);
        break;
      case 'Y':
        start = date.setFullYear(date.getFullYear() - 1);
        break;
      default:
        start = date.getTime();
        break;
    }
    return this.http.get<apiData>(`${this.apiUrl}/get/${sensor}/data/${format}/${start}/${end}`);
  }

  /**
   * Retrieves all weather data for a specific sensor.
   * @param sensor The sensor identifier.
   * @returns An Observable emitting all weather data for the sensor.
   */
  getWeatherDataBySensor(sensor: string): Observable<apiData> {
    return this.http.get<apiData>(`${this.apiUrl}/get/${sensor}/data/all/`);
  }

  /**
   * Retrieves the latest weather data entry for a specific sensor.
   * @param sensor The sensor identifier.
   * @returns An Observable emitting the latest weather data for the sensor.
   */
  getLastWeatherDataBySensor(sensor: string): Observable<apiData> {
    return this.http.get<apiData>(`${this.apiUrl}/get/${sensor}/data/last`);
  }

  /**
   * Retrieves weather data from the API starting from a specific date.
   * @param startDate The start date in ISO string format.
   * @returns An Observable emitting weather data from the specified start date.
   */
  getWeatherDataSince(startDate: string): Observable<apiData> {
    return this.http.get<apiData>(`${this.apiUrl}/get/data/since/${startDate}`);
  }

  /**
   * Retrieves sensor data for a specific sensor starting from a given date.
   * @param startDate The start date in ISO string format.
   * @param sensor The sensor identifier.
   * @returns An Observable emitting sensor data from the specified start date.
   */
  getSensorDataSince(startDate: string, sensor: string): Observable<apiData> {
    return this.http.get<apiData>(`${this.apiUrl}/get/${sensor}/since/${startDate}`);
  }

  /**
   * Retrieves monthly ordered data for a given sensor and year.
   * @param sensor The sensor identifier.
   * @param year The year for which the data is requested.
   * @returns An Observable emitting monthly ordered data.
   */
  getDataOrderedByMonthBySensor(sensor: string, year: number): Observable<apiData> {
    return this.http.get<apiData>(`${this.apiUrl}/get/${sensor}/monthlyordered/${year}`);
  }

  /**
   * Retrieves monthly ordered data for all sensors for a given year.
   * @param year The year for which the data is requested.
   * @returns An Observable emitting monthly ordered data for all sensors.
   */
  getDataOrderedByMonth(year: number): Observable<apiData> {
    return this.http.get<apiData>(`${this.apiUrl}/get/monthlyordered/${year}`);
  }

  /**
   * Retrieves monthly logs for a specific sensor.
   * @param sensor The sensor identifier.
   * @returns An Observable emitting monthly log data.
   */
  getMonthlyDataBySensor(sensor: string): Observable<apiData> {
    return this.http.get<apiData>(`${this.apiUrl}/get/${sensor}/monthly/log`);
  }

  /**
   * Retrieves monthly logs for all sensors.
   * @returns An Observable emitting monthly log data for all sensors.
   */
  getMonthlyData(): Observable<apiData> {
    return this.http.get<apiData>(`${this.apiUrl}/get/all/monthly/log`);
  }

  /**
   * Retrieves average temperature data for a specific sensor.
   * @param sensor The sensor identifier.
   * @returns An Observable emitting average temperature data.
   */
  getTempAVGDataBySensor(sensor: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get/${sensor}/data/avg/temp`);
  }
}