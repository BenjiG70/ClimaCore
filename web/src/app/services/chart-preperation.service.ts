import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';

interface StatData {
  label: string;
  data: number[];
}

@Injectable({
  providedIn: 'root'
})
export class ChartPreperationService {

  /**
   * Holds the formatted date, used internally.
   */
  formattedDate: any;

  /**
   * Holds the raw statistical data retrieved from the database.
   */
  stat: any;

  /**
   * Labels used for charts.
   */
  label: string[] = [];

  /**
   * 2D array for numeric statistical data.
   */
  statData: number[][] = [];

  /**
   * Daily statistics array of objects with label and data.
   */
  dailyStats: StatData[] = [];

  /**
   * Labels for daily statistics.
   */
  dayLabel: string[] = [];

  /**
   * Weekly statistics array of objects with label and data.
   */
  weeklyStats: StatData[] = [];

  /**
   * Labels for weekly statistics.
   */
  weekLabel: string[] = [];

  /**
   * Monthly statistics array of objects with label and data.
   */
  monthlyStats: StatData[] = [];

  /**
   * Labels for monthly statistics.
   */
  monthLabel: string[] = [];

  /**
   * Yearly statistics array of objects with label and data.
   */
  yearlyStats: StatData[] = [];

  /**
   * Labels for yearly statistics.
   */
  yearLabel: string[] = [];

  /**
   * Constructor to inject the DatabaseService.
   * @param db The database service used for fetching sensor data.
   */
  constructor(private db: DatabaseService) { }

  /**
   * Loads and prepares weather data for different intervals (daily, weekly, monthly, yearly)
   * for a given sensor. Fetches temperature and humidity data and organizes it for chart usage.
   *
   * @param sensor The sensor identifier string.
   * @returns A promise resolving to an array containing labels and stats arrays for each interval.
   */
  async loadData(sensor: any): Promise<(string[] | StatData[])[]> {
    let [label, temp, hum] = await this.getData('H', sensor);
    this.dayLabel = label;
    this.dailyStats = [
      { label: 'Temperatur', data: temp },
      { label: 'Luftfeuchtigkeit', data: hum }
    ];

    [label, temp, hum] = await this.getData('W', sensor);
    this.weekLabel = label;
    this.weeklyStats = [
      { label: 'Temperatur', data: temp },
      { label: 'Luftfeuchtigkeit', data: hum }
    ];

    [label, temp, hum] = await this.getData('M', sensor);
    this.monthLabel = label;
    this.monthlyStats = [
      { label: 'Temperatur', data: temp },
      { label: 'Luftfeuchtigkeit', data: hum }
    ];

    [label, temp, hum] = await this.getData('Y', sensor);
    this.yearLabel = label;
    this.yearlyStats = [
      { label: 'Temperatur', data: temp },
      { label: 'Luftfeuchtigkeit', data: hum }
    ];

    return [
      this.dayLabel, this.dailyStats,
      this.weekLabel, this.weeklyStats,
      this.monthLabel, this.monthlyStats,
      this.yearLabel, this.yearlyStats
    ];
  }

  /**
   * Fetches weather data for a given interval and sensor from the database service.
   *
   * @param intervall The aggregation interval string ('H', 'W', 'M', 'Y').
   * @param sensor The sensor identifier string.
   * @returns A promise resolving to a tuple with arrays for labels, temperature, and humidity.
   */
  getData(intervall: string, sensor: string): Promise<[string[], number[], number[]]> {
    return new Promise((resolve, reject) => {
      this.db.getSensorDataByRange(sensor, intervall, Date.now()).subscribe(
        (answer: unknown) => {
          if (typeof answer === 'object' && answer !== null) {
            this.stat = Object.values(answer as Record<string, unknown>);
            const result = this.prepareData(this.stat);
            resolve(result);
          } else {
            reject('Response is not a valid object');
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  /**
   * Converts raw chart data into separate arrays of labels, temperature values, and humidity values.
   *
   * @param chartData An array of objects containing time, temperature, and humidity properties.
   * @returns A tuple with three arrays: labels, temperatures, and humidities.
   */
  prepareData(chartData: { time: string; temp: number; hum: number }[]): [string[], number[], number[]] {
    const label: string[] = [];
    const temp: number[] = [];
    const hum: number[] = [];
    for (const dataKey in chartData) {
      label.push(chartData[dataKey].time);
      temp.push(chartData[dataKey].temp);
      hum.push(chartData[dataKey].hum);
    }
    return [label, temp, hum];
  }
}
