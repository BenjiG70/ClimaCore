import { TypeModifier } from '@angular/compiler';
import { Component, Input } from '@angular/core';

/**
 * WeathercardsComponent
 * 
 * This component displays weather data such as temperature, humidity,
 * air pressure, rain status, and a formatted date for a given sensor.
 */
@Component({
  selector: 'app-weathercards',
  templateUrl: './weathercards.component.html',
  styleUrl: './weathercards.component.scss'
})
export class WeathercardsComponent {

  /**
   * Private backing field for the raw date input.
   */
  private _date: any = "NaN";

  /**
   * Formatted date string for display purposes.
   * Initialized to the current date.
   */
  formattedDate: any = new Date();

  /**
   * Sensor identifier string.
   * Defaults to "default" if not provided.
   */
  @Input() sensor: string = "default";

  /**
   * Private backing field for temperature value.
   */
  private _temperature: number = 0;

  /**
   * Private backing field for humidity value.
   */
  private _humidity: number = 0;

  /**
   * Private backing field for air pressure value.
   */
  private _airPressure: number = 0;

  /**
   * Temperature input property.
   * Setter rounds the value to one decimal place.
   */
  @Input()
  set temperature(value: number) {
    this._temperature = this.round(value);
  }

  /**
   * Temperature getter.
   */
  get temperature(): number {
    return this._temperature;
  }

  /**
   * Humidity input property.
   * Setter rounds the value to one decimal place.
   */
  @Input()
  set humidity(value: number) {
    this._humidity = this.round(value);
  }

  /**
   * Humidity getter.
   */
  get humidity(): number {
    return this._humidity;
  }

  /**
   * Air pressure input property.
   * Setter rounds the value to one decimal place.
   */
  @Input()
  set air_pressure(value: number) {
    this._airPressure = this.round(value);
  }

  /**
   * Air pressure getter.
   */
  get air_pressure(): number {
    return this._airPressure;
  }

  /**
   * Rounds a number to one decimal place.
   * 
   * @param value The number to round.
   * @returns The rounded number.
   */
  private round(value: number): number {
    return Math.round(value * 10) / 10;
  }

  /**
   * Rain status input property.
   * Indicates whether it is raining (true or false).
   */
  @Input() rain: boolean = false;

  /**
   * Date input property.
   * Setter converts the input value to a Date and formats it as a localized string.
   */
  @Input()
  set date(value: any) {
    this.formattedDate = new Date(Number(value)).toLocaleString();
  }

  /**
   * Date getter.
   */
  get date(): any {
    return this._date;
  }

  /**
   * Helper method to format a Date object into a German locale date string.
   * Returns 'Ungültiges Datum' if the date is invalid.
   * 
   * @param value Date object to format.
   * @returns Formatted date string or error message.
   */
  private formatDate(value: Date): string {
    if (isNaN(value.getTime())) {
      return 'Ungültiges Datum';
    }
    return value.toLocaleDateString('de-DE');
  }
}
