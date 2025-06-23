import { TestBed } from '@angular/core/testing';

import { ChartPreperationService } from './chart-preperation.service';

describe('ChartPreperationService', () => {
  let service: ChartPreperationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChartPreperationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
