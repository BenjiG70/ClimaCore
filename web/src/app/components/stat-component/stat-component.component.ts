import { Component, OnInit, OnChanges } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SensorService } from '../../services/sensor.service';
import { ChartPreperationService } from '../../services/chart-preperation.service';
import { statsData } from '../../datatypes/database_interaction';
interface StatData {
  label: string;
  data: number[];
}
@Component({
  selector: 'app-stat-component',
  templateUrl: './stat-component.component.html',
  styleUrl: './stat-component.component.scss'
})


export class StatComponentComponent implements OnInit {
  sensor!: any;
  formattedDate:any;
  stat:any;

  label: string[] = [];



  statData: number[][] = [];
  dailyStats: string[] | StatData[]=[];
  dayLabel: string[] | StatData[]=[];
  weeklyStats: string[] | StatData[]=[];
  weekLabel:string[] | StatData[]=[];
  monthlyStats: string[] | StatData[]=[];
  monthLabel: string[] | StatData[]=[];
  yearlyStats: string[] | StatData[]=[];
  yearLabel:string[] | StatData[]=[];


  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private sensorService: SensorService, 
    private charts: ChartPreperationService) {}

  async ngOnInit(): Promise<void> {
    this.sensor = this.sensorService.getSensor();
    if (!this.sensor) {
      // fallback: z.B. Umleitung oder Fehlerbehandlung
    }
    this.formattedDate = new Date(Number(this.sensor.DATE_TIME)).toLocaleString();
    [
        this.dayLabel, this.dailyStats,
        this.weekLabel, this.weeklyStats,
        this.monthLabel, this.monthlyStats,
        this.yearLabel, this.yearlyStats
      ] = await this.charts.loadData(this.sensor.sensor);  
    }

  goBack(){
    this.router.navigate(['home']); 
  }
}
