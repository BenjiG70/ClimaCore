import { Injectable } from '@angular/core';

/**
 * Service to store and retrieve sensor data temporarily.
 */
@Injectable({ providedIn: 'root' })
export class SensorService {
  private sensorData: any = null;

  /**
   * Stores the sensor data.
   * @param data The sensor data to store.
   */
  setSensor(data: any): void {
    this.sensorData = data;
  }

  /**
   * Retrieves the stored sensor data.
   * @returns The stored sensor data, or null if none is set.
   */
  getSensor(): any {
    return this.sensorData;
  }
}