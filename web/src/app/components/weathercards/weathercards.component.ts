import { TypeModifier } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-weathercards',
  templateUrl: './weathercards.component.html',
  styleUrl: './weathercards.component.scss'
})
export class WeathercardsComponent {

  private _date: any = "NaN"; // Private Variable für das Datum
  formattedDate: any = new Date();  // Für das formatierte Datum

  @Input() sensor:string = "default";
  private _temperature: number = 0;
  private _humidity: number = 0;
  private _airPressure: number = 0;

  @Input()
  set temperature(value: number) {
    this._temperature = this.round(value);
  }
  
  get temperature(): number {
    return this._temperature;
  }

  @Input()
  set humidity(value: number) {
    this._humidity = this.round(value);
  }
  
  get humidity(): number {
    return this._humidity;
  }

  @Input()
  set air_pressure(value: number) {
    this._airPressure = this.round(value);
  }
  
  get air_pressure(): number {
    return this._airPressure;
  }

  // Rundungsfunktion auf eine Dezimalstelle
  private round(value: number): number {
    return Math.round(value * 10) / 10; // Rundet auf eine Dezimalstelle
  }
  @Input() rain:boolean = false;

  
  @Input()
  set date(value: any) {
    this.formattedDate = new Date(Number(value)).toLocaleString();
  }

  get date(): any {
    return this._date;
  }

  private formatDate(value: Date): string {
    if (isNaN(value.getTime())) {
      return 'Ungültiges Datum';
    }
    return value.toLocaleDateString('de-DE');
  }
}


