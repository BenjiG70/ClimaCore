import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DatabaseService } from '../../services/database.service';
import { Subscription, interval } from 'rxjs';
import { Router } from '@angular/router';
import { SensorService } from '../../services/sensor.service';
import { ChartPreperationService } from '../../services/chart-preperation.service';
interface StatsPeriod{
  dailyStats: (string[] | StatData[]),
  weeklyStats: (string[] | StatData[]),
  monthlyStats: (string[] | StatData[]),
  yearlyStats: (string[] | StatData[])
}
interface StatData {
  label: string;
  data: number[];
}
@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent implements OnInit, OnDestroy {
  sensorsData: any[] = [];
  private sensors: string[] = [];
  private updateSubscription?: Subscription;
  private sensorDataforStats: any;
  statTempData: any;
  statHumData: any;
  statLabel: any;
  statTempDataCurrentYear: any;
  statHumDataCurrentYear: any;
  statLabelCurrentYear: any;
  statTempDataAllTime: any;
  statHumDataAllTime: any;
  statLabelAllTime: any;

statData: {
  [key: string]: StatsPeriod} = {};

  dailyStats: string[] | StatData[]=[];
  dayLabel: string[] | StatData[]=[];
  weeklyStats: string[] | StatData[]=[];
  weekLabel:string[] | StatData[]=[];
  monthlyStats: string[] | StatData[]=[];
  monthLabel: string[] | StatData[]=[];
  yearlyStats: string[] | StatData[]=[];
  yearLabel:string[] | StatData[]=[];

  dailyTemp: StatData[]=[];
  dailyHum: StatData[]=[];

  weeklyTemp: StatData[]=[];
  weeklyHum: StatData[]=[];

  monthlyTemp: StatData[]=[];
  monthlyHum: StatData[]=[];

  yearlyTemp: StatData[]=[];
  yearlyHum: StatData[]=[];

  @ViewChild('scrollContainer', { static: true }) scrollContainer!: ElementRef;

  constructor(
    private dbService: DatabaseService, 
    private router: Router, 
    private sensorService: SensorService,
    private charts: ChartPreperationService
  ) {}

  async ngOnInit(): Promise<void> {
    this.loadAllSensors();
    this.startDataRefresh();
      
  }

  loadAllSensors(): void {
    const reloadInterval = 5000; // 5 Sekunden
    let retryInterval: any;

    const fetchData = () => {
      this.dbService.getAllData().subscribe(
        async (data: unknown) => {
          if (this.isSensorData(data)) {
            if (retryInterval) {
              clearInterval(retryInterval); // Timer stoppen, wenn Daten erfolgreich geladen wurden
            }
            //this.sensorDataforStats = Object.values(data);
            this.sensors = Object.values(data).map(
              (sensorData) => sensorData.sensor
            );
            this.updateSensorsData(); 
          } else {
            // console.error('Unexpected data format:', data);
          }
        },
        (error: any) => {
          // console.error('Error fetching sensors data:', error);
          this.sensorsData = [];

          // Alle 5 Sekunden erneut versuchen, wenn keine Verbindung hergestellt werden kann
          if (!retryInterval) {
            retryInterval = setInterval(fetchData, reloadInterval);
          }
        }
      );
    };

    // Erste Datenabfrage
    fetchData();
  }


  /**
   * Funktion zur Umwandlung der Rohdaten in die benötigte Form
   * @returns 
   */
  /*sortDataByimportant() {
    const data = this.sensorDataforStats;
    const time: any[] = [];
    const temp: any[] = [];
    const hum: any[] = [];

    for (let i = 0; i < Object.keys(data).length; i++) {
      temp.push(data[i].temperature);
      hum.push(data[i].humidity);
      time.push(new Date(Number(data[i].DATE_TIME)).getTime());
    }

    return { temp, hum, time };
  }
  /**
   * Funktion, um die letztmöglichen Wetterdaten aus der Datenbank über den Datenbankservice abzurufen.
   */
async updateSensorsData(): Promise<void> {
  try {
    // Einzigartige Sensoren, um unnötige Abfragen zu vermeiden
    const uniqueSensors = [...new Set(this.sensors)];

    // Array von Promises, die jeweils die Daten für einen Sensor laden
    const sensorDataPromises = uniqueSensors.map(sensor =>
      this.dbService.getLastWeatherDataBySensor(sensor).toPromise()
    );

    // Warte bis alle geladen sind
    const allData = await Promise.all(sensorDataPromises);

    // Leere die vorhandenen Sensordaten
    this.sensorsData = [];

    for (const data of allData) {
      if (this.isWeatherData(data)) {
        const dataArray = Object.values(data);
        const latestData = dataArray[0];
        // Nur einzigartige Sensor-Daten pushen
        if (!this.sensorsData.some(d => d.sensor === latestData.sensor)) {
          this.sensorsData.push(latestData);
        }
      } else {
        console.error(`Unexpected data format:`, data);
      }
    }
    
    for (const sens of uniqueSensors) {
      [
        this.dayLabel, this.dailyStats,
        this.weekLabel, this.weeklyStats,
        this.monthLabel, this.monthlyStats,
        this.yearLabel, this.yearlyStats
      ] = await this.charts.loadData(sens);
      if (!this.statData[sens]) {
        this.statData[sens] = {} as any;
      }
      this.statData[sens].dailyStats=this.dailyStats;
      this.statData[sens].weeklyStats=this.weeklyStats;
      this.statData[sens].monthlyStats=this.monthlyStats;
      this.statData[sens].yearlyStats=this.yearlyStats;
    }

    for (const key in this.statData){
      let newStat: StatData = {
        label: key,
        data: (this.statData[key].dailyStats as StatData[])[0].data
      }
      this.dailyTemp.push(newStat);
      newStat = {
        label: key,
        data: (this.statData[key].dailyStats as StatData[])[1].data
      }
      this.dailyHum.push(newStat);

      newStat = {
        label: key,
        data: (this.statData[key].weeklyStats as StatData[])[0].data
      }
      this.weeklyTemp.push(newStat);
      newStat = {
        label: key,
        data: (this.statData[key].weeklyStats as StatData[])[1].data
      }
      this.weeklyHum.push(newStat);

      newStat = {
        label: key,
        data: (this.statData[key].monthlyStats as StatData[])[0].data
      }
      this.monthlyTemp.push(newStat);
      newStat = {
        label: key,
        data: (this.statData[key].monthlyStats as StatData[])[1].data
      }
      this.monthlyHum.push(newStat);

      newStat = {
        label: key,
        data: (this.statData[key].yearlyStats as StatData[])[0].data
      }
      this.yearlyTemp.push(newStat);
      newStat = {
        label: key,
        data: (this.statData[key].yearlyStats as StatData[])[1].data
      }
      this.yearlyHum.push(newStat);



    }
  } catch (error) {
    console.error('Error updating sensors data:', error);
  }
}

  /**
   * Funktion, welche alle 60 Sekunden die Sensorwerte neu abruft, um aktuelle Daten abzurufen
   */
  startDataRefresh(): void {
    this.updateSubscription = interval(60000).subscribe(() => {
      this.updateSensorsData();
    });
  }
  /**
   * 
   * @param sensor 
   */
  openDialog(sensor: any): void {
    this.sensorService.setSensor(sensor);
    this.router.navigate(['/stats']);
  }
  /**
   * 
   */
  ngOnDestroy(): void {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }
  /**
   * Funktion, um zu prüfen, ob ein gewolltes Wetterobjekt auch dem Datentyp entspricht
   * @private
   * @param data 
   * @returns 
   */
  private isSensorData(data: unknown): data is { [key: string]: { sensor: string } } {
    return (
      typeof data === 'object' &&
      data !== null &&
      Object.values(data).every((item) => 'sensor' in item)
    );
  }

  /**
   * Funktion, um zu prüfen, ob ein gewolltes Wetterobjekt auch dem Datentyp entspricht
   * @private
   * @param data 
   * @returns 
   */
  private isWeatherData(data: unknown): data is { [key: string]: any } {
    return (
      typeof data === 'object' &&
      data !== null &&
      Object.values(data).every((item) => 'sensor' in item)
    );
  }
    

  scrollRight() {
    const container = this.scrollContainer.nativeElement;
    const scrollAmount = container.offsetWidth;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }

  scrollLeft() {
    const container = this.scrollContainer.nativeElement;
    const scrollAmount = container.offsetWidth;
    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  }
}
