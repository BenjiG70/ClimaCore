import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent {
  
  @Input() sensor:any;
  @Input() title?:string;
  @Input() style?:'bar' | 'line' | 'scatter' | 'bubble' | 'pie' | 'doughnut' | 'polarArea' | 'radar';
  @Input() options:any;
  @Input() labels?:string[];
  @Input() data?:number[][];
  @Input() chartColor?:string;

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
      labels: this.labels || [],
      datasets: [
        {
          label: this.title || (this.sensor?.name ?? 'Sensor'),
          data: this.data || [],
          backgroundColor: this.getColorArray(),
          borderColor: this.getColorArray(),
          borderWidth: 1,
          fill: this.style === 'line' ? false : true,
          type: this.style || 'bar',
        }
      ]
    };
  }

  getColorArray(): string[] {
  const length = this.data?.length || 1;
  return Array(length).fill(this.chartColor || '#424242');
}
}