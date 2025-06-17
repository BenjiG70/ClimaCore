import { Component, Input } from '@angular/core';
import { ChartModule } from 'primeng/chart';
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent {

  options_bar = {
    responsive: false,
    scales: {
      x: {},
      y: {
        beginAtZero: true
      }
    }
  };
  labels_year = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  labels_week = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
  labels_workweek = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag'];
  labels_hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];

  @Input() sensor:any="";
  @Input() title:string = "undefined";
  @Input() style:'bar' | 'line' | 'scatter' | 'bubble' | 'pie' | 'doughnut' | 'polarArea' | 'radar' = 'bar';
  @Input() options:any;
  @Input() labels:string[]=this.labels_year;
  @Input() data:number[]=[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  @Input() chartColor:string="#424242";

  src: any;

  ngOnInit() {
    this.updateChart();
  }
  ngOnChanges() {
    // Jedes Mal, wenn sich ein Input wie "data" ändert, wird das Diagramm aktualisiert
    this.updateChart();
  }

  updateChart() {
    this.src = {
      labels: this.labels,
      datasets: [
        {
          label: this.title,
          data: this.data,
          backgroundColor: [this.chartColor]
        }
      ]
    };
  }
}
