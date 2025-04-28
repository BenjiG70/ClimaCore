import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeathercardsComponent } from './weathercards.component';

describe('WeathercardsComponent', () => {
  let component: WeathercardsComponent;
  let fixture: ComponentFixture<WeathercardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WeathercardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeathercardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
