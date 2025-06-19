import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss'
})
export class PopupComponent {
  formattedDate:any;
  stat:any;

  label: string[] = [];

  statData: number[][] = [];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private db: DatabaseService) {
    this.formattedDate = new Date(Number(data.DATE_TIME)).toLocaleString();
    
    this.getData().then(([label, temp, hum]) => {
      this.label = label;
      this.statData[0]=temp;
      this.statData[1]=hum;

    }
  );


  }  
  closeDialog(){
    
  }

  getData(): Promise<[string[], number[], number[]]> {
    return new Promise((resolve, reject) => {
      this.db.getSensorDataByRange(this.data.sensor, 'H', '2025-06-19 12:00:00').subscribe(
        (answer: unknown) => {
          if (typeof answer === 'object' && answer !== null) {
            this.stat = Object.values(answer as Record<string, unknown>);
            const result = this.prepareData(this.stat);
            resolve(result); // Promise erfolgreich aufgelöst
          } else {
            reject('Antwort ist kein gültiges Objekt');
          }
        },
        (error) => {
          reject(error); // Fehler beim Observable
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

  /**
   *  @Input() sensor:any;
      @Input() title?:string;
      @Input() style?:'bar' | 'line' | 'scatter' | 'bubble' | 'pie' | 'doughnut' | 'polarArea' | 'radar';
      @Input() options:any;
      @Input() labels?:string[];
      @Input() data?:number[];
      @Input() chartColor?:string;
   */


  /**
   * labels_year = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
     labels_week = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
     labels_workweek = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag'];
     labels_hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
   
   */
}
