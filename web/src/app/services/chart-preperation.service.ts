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

  constructor(private db: DatabaseService) { }

  formattedDate:any;
  stat:any;

  label: string[] = [];

  statData: number[][] = [];
  dailyStats: StatData[]=[];
  dayLabel: string[]=[];
  weeklyStats: StatData[]=[];
  weekLabel:string[]=[];
  monthlyStats: StatData[]=[];
  monthLabel:string[]=[];
  yearlyStats: StatData[]=[];
  yearLabel:string[]=[];

  async loadData(sensor:any) {
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

  getData(intervall:string, sensor:string): Promise<[string[], number[], number[]]> {
    return new Promise((resolve, reject) => {
      this.db.getSensorDataByRange(sensor, intervall, Date.now()).subscribe(
        (answer: unknown) => {
          if (typeof answer === 'object' && answer !== null) {
            this.stat = Object.values(answer as Record<string, unknown>);
            const result = this.prepareData(this.stat);
            resolve(result);
          } else {
            reject('Antwort ist kein gültiges Objekt');
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }


  prepareData(chartData: { time: string, temp: number, hum: number }[]): [string[], number[], number[]] {
    var label: string[] = [];
    var temp: number[] =[];
    var hum: number[] =[];
    for(var dataKey in chartData){
      label.push(chartData[dataKey].time);
      temp.push(chartData[dataKey].temp);
      hum.push(chartData[dataKey].hum);
    }

    return [label, temp, hum];
  }
}
