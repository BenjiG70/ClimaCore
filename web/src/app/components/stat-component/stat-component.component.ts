import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SensorService } from '../../services/sensor.service';
import { ChartPreperationService } from '../../services/chart-preperation.service';

/**
 * Interface representing a dataset used in statistics.
 */
interface StatData {
  /**
   * Label for the dataset, e.g., "Temperature", "Humidity".
   */
  label: string;

  /**
   * Array of numerical values representing the data points.
   */
  data: number[];
}

/**
 * StatComponentComponent
 * 
 * This component displays statistical evaluations for a single sensor.
 * It loads and prepares data for different time periods (daily, weekly, monthly, yearly)
 * and presents these statistics accordingly.
 */
@Component({
  selector: 'app-stat-component',
  templateUrl: './stat-component.component.html',
  styleUrl: './stat-component.component.scss'
})
export class StatComponentComponent implements OnInit {
  
  /**
   * Sensor object containing sensor data and metadata.
   */
  sensor!: any;

  /**
   * Formatted date string representing the timestamp of the latest data.
   */
  formattedDate: any;

  /**
   * General statistics data (unspecified).
   */
  stat: any;

  /**
   * Array of labels for charts.
   */
  label: string[] = [];

  /**
   * Statistical data as nested arrays (e.g., measurement values).
   */
  statData: number[][] = [];

  /**
   * Daily statistics; can be an array of strings or `StatData` objects.
   */
  dailyStats: string[] | StatData[] = [];
  dayLabel: string[] | StatData[] = [];

  /**
   * Weekly statistics.
   */
  weeklyStats: string[] | StatData[] = [];
  weekLabel: string[] | StatData[] = [];

  /**
   * Monthly statistics.
   */
  monthlyStats: string[] | StatData[] = [];
  monthLabel: string[] | StatData[] = [];

  /**
   * Yearly statistics.
   */
  yearlyStats: string[] | StatData[] = [];
  yearLabel: string[] | StatData[] = [];

  /**
   * Constructor with Dependency Injection.
   * 
   * @param router Angular Router for navigation
   * @param route ActivatedRoute for route parameters
   * @param sensorService Service to access sensor data
   * @param charts Service to prepare chart data
   */
  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private sensorService: SensorService, 
    private charts: ChartPreperationService
  ) {}

  /**
   * Component initialization lifecycle hook.
   * 
   * Retrieves the current sensor object from the SensorService.
   * Formats the date of the latest measurement.
   * Loads statistical data for various time intervals.
   */
  async ngOnInit(): Promise<void> {
    this.sensor = this.sensorService.getSensor();
    if (!this.sensor) {
      // Fallback: add navigation or error handling here if needed
    }
    this.formattedDate = new Date(Number(this.sensor.DATE_TIME)).toLocaleString();
    
    [
      this.dayLabel, this.dailyStats,
      this.weekLabel, this.weeklyStats,
      this.monthLabel, this.monthlyStats,
      this.yearLabel, this.yearlyStats
    ] = await this.charts.loadData(this.sensor.sensor);
  }

  /**
   * Navigates back to the home page.
   */
  goBack(): void {
    this.router.navigate(['home']); 
  }
}
