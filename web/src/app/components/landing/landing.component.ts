import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DatabaseService } from '../../services/database.service';
import { PopupComponent } from '../popup/popup.component';
import { Subscription, interval } from 'rxjs';

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

  constructor(private dbService: DatabaseService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadAllSensors();
    this.startDataRefresh();
  }

  loadAllSensors(): void {
    const reloadInterval = 5000; // 5 Sekunden
    let retryInterval: any;

    const fetchData = () => {
      this.dbService.getAllData().subscribe(
        (data: unknown) => {
          if (this.isSensorData(data)) {
            if (retryInterval) {
              clearInterval(retryInterval); // Timer stoppen, wenn Daten erfolgreich geladen wurden
            }
            this.sensorDataforStats = Object.values(data);
            this.sensors = Object.values(data).map(
              (sensorData) => sensorData.sensor
            );
            this.getStatsData();
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
   * Hilfsfunktion, um den Monatsnamen anhand des Indexes des Monats zurückzugeben
   * @param index
   * @returns string
   */
  getMonthName(index: number): string {
    const monthNames = [
      'Januar',
      'Februar',
      'März',
      'April',
      'Mai',
      'Juni',
      'Juli',
      'August',
      'September',
      'Oktober',
      'November',
      'Dezember',
    ];
    return monthNames[index];
  }

  // Funktion zur Berechnung der Monatsdurchschnittswerte (All Time oder aktuelles Jahr)
  avgData(months: { [key: number]: number[][] }): {
    [key: string]: { avgTemp: number; avgHum: number };
  } {
    const averages: { [key: string]: { avgTemp: number; avgHum: number } } = {};

    for (const monthKey in months) {
      const dataArray = months[monthKey];
      let tempSum = 0;
      let humSum = 0;

      // Summiere alle Temperatur- und Feuchtigkeitswerte im Monat
      for (const [_, temp, hum] of dataArray) {
        tempSum += temp;
        humSum += hum;
      }

      // Durchschnitt berechnen
      const avgTemp = tempSum / dataArray.length;
      const avgHum = humSum / dataArray.length;

      // Monat und Jahr aus monthKey extrahieren
      const year = Math.floor(Number(monthKey) / 100);
      const month = Number(monthKey) % 100;

      // Monatname als String
      const monthName = this.getMonthName(month);
      const key = `${monthName} ${year}`;

      // Durchschnittswerte speichern
      averages[key] = { avgTemp, avgHum };
    }

    return averages;
  }

  /**
   * Funktion, um zurückgegebene Daten nach Monat zu sortieren und, wenn gewünscht nach Jahren zu filtern
   * @param time number Array
   * @param temp number Array
   * @param hum number Array
   * @param filterYear number
   * @returns 2D Array
   */
  sortDataByMonth(time: number[], temp: number[], hum: number[],filterYear?: number) {
    const months: { [key: number]: number[][] } = {};

    for (let i = 0; i < time.length; i++) {
      const date: Date = new Date(time[i]);
      const month: number = date.getUTCMonth();
      const year: number = date.getUTCFullYear();
      const index: number = year * 100 + month;

      // Filtere, wenn ein bestimmtes Jahr gewünscht ist
      if (filterYear && year !== filterYear) continue;

      if (!months[index]) {
        months[index] = [];
      }

      months[index].push([time[i], temp[i], hum[i]]);
    }

    return months;
  }

  /**
   * Funktion zur Vorbereitung der Chart-Daten für ein gegebenes Jahr
   * @param monthlyAverages Dictionary
   * @param year number
   * @returns Temperaturdaten, Luftfeuchtigkeitsdaten sowie Labels
   */
  prepareChartData(monthlyAverages: { [key: string]: { avgTemp: number; avgHum: number } }, year: number) {
    const date = new Date();
    const start_month = date.getUTCMonth();
    var monthLabels = [];
    for (var i = 0; monthLabels.length <= 12; i++) {
      if (start_month - i >= 0) {
        monthLabels[i] = this.getMonthName(start_month - i);
      } else {
        for (var j = 0; monthLabels.length <= 12; j++) {
          monthLabels[i] = this.getMonthName(12 - j);
          i++;
        }
      }
    }
    const Labels = monthLabels.reverse();
    const tempData: number[] = [];
    const humData: number[] = [];

    Labels.forEach((monthName, index) => {
      const key = `${monthName} ${year}`;
      const data = monthlyAverages[key];

      if (data) {
        tempData.push(data.avgTemp);
        humData.push(data.avgHum);
      } else {
        tempData.push(0);
        humData.push(0);
      }
    });

    return { tempData, humData, monthLabels };
  }



  /**
   * Funktion, um Daten für die Statistiken zu generieren
   */
  getStatsData() {
    const { temp, hum, time } = this.sortDataByimportant();

    const currentYear = new Date().getFullYear();

    // Daten für aktuelles Jahr filtern und berechnen
    const sortedDataCurrentYear = this.sortDataByMonth(
      time,
      temp,
      hum,
      currentYear
    );
    const avgValuesCurrentYear = this.avgData(sortedDataCurrentYear);
    const {
      tempData: tempDataCurrentYear,
      humData: humDataCurrentYear,
      monthLabels: monthLabelsCurrentYear,
    } = this.prepareChartData(avgValuesCurrentYear, currentYear);

    // All Time Daten berechnen
    const sortedDataAllTime = this.sortDataByMonth(time, temp, hum);
    const avgValuesAllTime = this.avgData(sortedDataAllTime);
    const {
      tempData: tempDataAllTime,
      humData: humDataAllTime,
      monthLabels: monthLabelsAllTime,
    } = this.prepareChartData(avgValuesAllTime, currentYear);

    // Zuweisung an die statischen Variablen
    this.statTempDataCurrentYear = tempDataCurrentYear;
    this.statHumDataCurrentYear = humDataCurrentYear;
    this.statLabelCurrentYear = monthLabelsCurrentYear;

    this.statTempDataAllTime = tempDataAllTime;
    this.statHumDataAllTime = humDataAllTime;
    this.statLabelAllTime = monthLabelsAllTime;
  }

  /**
   * Funktion zur Umwandlung der Rohdaten in die benötigte Form
   * @returns 
   */
  sortDataByimportant() {
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
  updateSensorsData(): void {
    this.sensors.forEach((sensor) => {
      this.dbService.getLastWeatherDataBySensor(sensor).subscribe(
        (data: unknown) => {
          if (this.isWeatherData(data)) {
            const dataArray = Object.values(data);
            const latestData = dataArray[0];
            this.sensorsData = this.sensorsData.filter(
              (d) => d.sensor !== latestData.sensor
            );
            this.sensorsData.push(latestData);
          } else {
            console.error(`Unexpected data format for sensor ${sensor}:`, data);
          }
        },
        (error: any) => {
          console.error(
            `Error fetching last data for sensor ${sensor}:`,
            error
          );
        }
      );
    });
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
    const dialogRef = this.dialog.open(PopupComponent, {
      data: sensor,
      height: '300px',
      width: '1000px',
      restoreFocus: false,
      disableClose: false,

    });
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
}
