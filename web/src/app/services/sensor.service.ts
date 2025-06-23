import { Injectable } from '@angular/core';

// sensor.service.ts
@Injectable({ providedIn: 'root' })
export class SensorService {
  private sensorData: any = null;

  setSensor(data: any) {
    this.sensorData = data;
  }

  getSensor() {
    return this.sensorData;
  }
}

