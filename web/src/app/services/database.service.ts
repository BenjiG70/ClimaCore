import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiData } from '../datatypes/database_interaction'

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  //api_Url mit port
  private apiUrl = 'http://127.0.0.1:4202';
  
  constructor(private http: HttpClient) {}

  /**
   * Ruft alle Sensordaten von der API ab.
   */
  getAllData(): Observable<apiData> {
    return this.http.get<apiData>(`${this.apiUrl}/get/all/data`);
  }

  getSensors(): Observable<apiData> {
    return this.http.get<apiData>(`${this.apiUrl}/get/all/sensors`);
  }

  /**
   * 
   * @param sensor 
   * @param format Format: H|W|M|Y
   * @param enddate Format: YYYY-MM-DD HH:mm:SS
   * @returns 
   */
  getSensorDataByRange(sensor:string, format:string, enddate:number): Observable<apiData> {
    const date = new Date(enddate);
    const end = date.getTime();
    var start;
    switch(format){
      case('H'):
        start = date.setDate(date.getDate() - 1);
        break;
      case('W'):
        start = date.setDate(date.getDate() - 7);
        break;
      case('M'):
        start = date.setMonth(date.getMonth() -1);
        break;
      case('Y'):
        start = date.setFullYear(date.getFullYear() - 1);
        break;
    }
    return this.http.get<apiData>(`${this.apiUrl}/get/${sensor}/data/${format}/${start}/${end}`)
  }

  /**
   * Ruft die Sensordaten für einen bestimmten Sensor ab.
   * @param sensor Der Name des Sensors.
   */
  getWeatherDataBySensor(sensor: string): Observable<apiData> {
    return this.http.get<apiData>(`${this.apiUrl}/get/${sensor}/data/all/`);
  }

  /**
   * Ruft die letzten Sensordaten für einen bestimmten Sensor ab.
   * @param sensor Der Name des Sensors.
   */
  getLastWeatherDataBySensor(sensor: string): Observable<apiData> {
    return this.http.get<apiData>(`${this.apiUrl}/get/${sensor}/data/last`);
  }

  /**
   * Ruft Sensordaten seit einem bestimmten Datum ab.
   * @param startDate Das Startdatum im ISO-Format.
   */
  getWeatherDataSince(startDate: string): Observable<apiData> {
    return this.http.get<apiData>(`${this.apiUrl}/get/data/since/${startDate}`);
  }

  /**
   * Ruft Sensordaten von einem Sensor seit einem bestimmten Datum ab.
   * @param startDate Das Startdatum im ISO-Format.
   */
  getSensorDataSince(startDate: string, sensor:string): Observable<apiData> {
    return this.http.get<apiData>(`${this.apiUrl}/get/${sensor}/since/${startDate}`);
  }

  getDataOrderedByMonthBySensor(sensor:string, year:number): Observable<apiData>{
    return this.http.get<apiData>(`${this.apiUrl}/get/${sensor}/monthlyordered/${year}`);
  }

  getDataOrderedByMonth(year:number){
    return this.http.get<apiData>(`${this.apiUrl}/get/monthlyordered/${year}`);
  }

  getMonthlyDataBySensor(sensor:string){
    return this.http.get<apiData>(`${this.apiUrl}/get/${sensor}/monthly/log)`);
  }
  getMonthlyData(){
    return this.http.get<apiData>(`${this.apiUrl}/get/all/monthly/log)`);
  }
  getTempAVGDataBySensor(sensor:string){
    return this.http.get<any>(`${this.apiUrl}/get/${sensor}/data/avg/temp`);
  }

}