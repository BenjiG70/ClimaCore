/**
 * LandingComponent
 * 
 * This component acts as the landing page of the application. It displays the latest sensor data and statistical chart data
 * (daily, weekly, monthly, and yearly) for multiple sensors. Data is refreshed automatically in intervals.
 *
 * Features:
 * - Fetches and processes sensor data from a database.
 * - Aggregates statistical data for various time periods.
 * - Displays the latest values and trends.
 * - Provides a scrollable view and navigation to detailed statistics.
 */

import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DatabaseService } from '../../services/database.service';
import { Subscription, interval } from 'rxjs';
import { Router } from '@angular/router';
import { SensorService } from '../../services/sensor.service';
import { ChartPreperationService } from '../../services/chart-preperation.service';

/**
 * Represents statistical data sets for each time period.
 */
interface StatsPeriod {
  dailyStats: (string[] | StatData[]);
  weeklyStats: (string[] | StatData[]);
  monthlyStats: (string[] | StatData[]);
  yearlyStats: (string[] | StatData[]);
}

/**
 * Represents a single dataset used in a chart.
 */
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

  // Statistical chart data placeholders
  statTempData: any;
  statHumData: any;
  statLabel: any;
  statTempDataCurrentYear: any;
  statHumDataCurrentYear: any;
  statLabelCurrentYear: any;
  statTempDataAllTime: any;
  statHumDataAllTime: any;
  statLabelAllTime: any;

  statData: { [key: string]: StatsPeriod } = {};

  dailyStats: string[] | StatData[] = [];
  dayLabel: string[] | StatData[] = [];
  weeklyStats: string[] | StatData[] = [];
  weekLabel: string[] | StatData[] = [];
  monthlyStats: string[] | StatData[] = [];
  monthLabel: string[] | StatData[] = [];
  yearlyStats: string[] | StatData[] = [];
  yearLabel: string[] | StatData[] = [];

  // Final chart data arrays grouped by period and type
  dailyTemp: StatData[] = [];
  dailyHum: StatData[] = [];
  weeklyTemp: StatData[] = [];
  weeklyHum: StatData[] = [];
  monthlyTemp: StatData[] = [];
  monthlyHum: StatData[] = [];
  yearlyTemp: StatData[] = [];
  yearlyHum: StatData[] = [];

  @ViewChild('scrollContainer', { static: true }) scrollContainer!: ElementRef;

  constructor(
    private dbService: DatabaseService,
    private router: Router,
    private sensorService: SensorService,
    private charts: ChartPreperationService
  ) {}

  /**
   * Angular lifecycle method that runs on component initialization.
   * Starts sensor data loading and sets up the auto-refresh interval.
   */
  async ngOnInit(): Promise<void> {
    this.loadAllSensors();
    this.startDataRefresh();
  }

  /**
   * Fetches all sensor metadata and initializes data loading.
   * Retries periodically if the connection fails.
   */
  loadAllSensors(): void {
    const reloadInterval = 5000; // 5 seconds
    let retryInterval: any;

    const fetchData = () => {
      this.dbService.getAllData().subscribe(
        async (data: unknown) => {
          if (this.isSensorData(data)) {
            if (retryInterval) {
              clearInterval(retryInterval);
            }
            this.sensors = Object.values(data).map(sensorData => sensorData.sensor);
            this.updateSensorsData();
          }
        },
        (error: any) => {
          this.sensorsData = [];
          if (!retryInterval) {
            retryInterval = setInterval(fetchData, reloadInterval);
          }
        }
      );
    };

    fetchData();
  }

  /**
   * Retrieves and prepares chart data for all sensors.
   * Populates the data used in daily, weekly, monthly, and yearly statistics.
   */
  async updateSensorsData(): Promise<void> {
    this.dailyTemp = [];
    this.dailyHum = [];
    this.weeklyTemp = [];
    this.weeklyHum = [];
    this.monthlyTemp = [];
    this.monthlyHum = [];
    this.yearlyTemp = [];
    this.yearlyHum = [];

    try {
      const uniqueSensors = [...new Set(this.sensors)];
      const sensorDataPromises = uniqueSensors.map(sensor =>
        this.dbService.getLastWeatherDataBySensor(sensor).toPromise()
      );
      const allData = await Promise.all(sensorDataPromises);
      this.sensorsData = [];

      for (const data of allData) {
        if (this.isWeatherData(data)) {
          const dataArray = Object.values(data);
          const latestData = dataArray[0];
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

        this.statData[sens].dailyStats = this.dailyStats;
        this.statData[sens].weeklyStats = this.weeklyStats;
        this.statData[sens].monthlyStats = this.monthlyStats;
        this.statData[sens].yearlyStats = this.yearlyStats;
      }

      for (const key in this.statData) {
        let newStat: StatData = {
          label: key,
          data: (this.statData[key].dailyStats as StatData[])[0].data
        };
        this.dailyTemp.push(newStat);

        newStat = {
          label: key,
          data: (this.statData[key].dailyStats as StatData[])[1].data
        };
        this.dailyHum.push(newStat);

        newStat = {
          label: key,
          data: (this.statData[key].weeklyStats as StatData[])[0].data
        };
        this.weeklyTemp.push(newStat);

        newStat = {
          label: key,
          data: (this.statData[key].weeklyStats as StatData[])[1].data
        };
        this.weeklyHum.push(newStat);

        newStat = {
          label: key,
          data: (this.statData[key].monthlyStats as StatData[])[0].data
        };
        this.monthlyTemp.push(newStat);

        newStat = {
          label: key,
          data: (this.statData[key].monthlyStats as StatData[])[1].data
        };
        this.monthlyHum.push(newStat);

        newStat = {
          label: key,
          data: (this.statData[key].yearlyStats as StatData[])[0].data
        };
        this.yearlyTemp.push(newStat);

        newStat = {
          label: key,
          data: (this.statData[key].yearlyStats as StatData[])[1].data
        };
        this.yearlyHum.push(newStat);
      }
    } catch (error) {
      console.error('Error updating sensors data:', error);
    }
  }

  /**
   * Starts a 60-second interval that continuously updates the sensor data.
   */
  startDataRefresh(): void {
    this.updateSubscription = interval(60000).subscribe(() => {
      this.updateSensorsData();
    });
  }

  /**
   * Opens the statistics dialog for a specific sensor by navigating to the stats route.
   * @param sensor The selected sensor to show detailed statistics for.
   */
  openDialog(sensor: any): void {
    this.sensorService.setSensor(sensor);
    this.router.navigate(['/stats']);
  }

  /**
   * Cleans up any active subscriptions when the component is destroyed.
   */
  ngOnDestroy(): void {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }

  /**
   * Type guard to check whether fetched data is valid sensor data.
   * @param data The data to check.
   * @returns True if valid sensor data, otherwise false.
   */
  private isSensorData(data: unknown): data is { [key: string]: { sensor: string } } {
    return (
      typeof data === 'object' &&
      data !== null &&
      Object.values(data).every((item) => 'sensor' in item)
    );
  }

  /**
   * Type guard to check whether fetched data is valid weather data.
   * @param data The data to check.
   * @returns True if valid weather data, otherwise false.
   */
  private isWeatherData(data: unknown): data is { [key: string]: any } {
    return (
      typeof data === 'object' &&
      data !== null &&
      Object.values(data).every((item) => 'sensor' in item)
    );
  }

  /**
   * Scrolls the chart container to the right by the width of the container.
   */
  scrollRight(): void {
    const container = this.scrollContainer.nativeElement;
    const scrollAmount = container.offsetWidth;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }

  /**
   * Scrolls the chart container to the left by the width of the container.
   */
  scrollLeft(): void {
    const container = this.scrollContainer.nativeElement;
    const scrollAmount = container.offsetWidth;
    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  }
} 