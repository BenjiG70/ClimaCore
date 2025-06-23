import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './components/landing/landing.component';
import { WeathercardsComponent } from './components/weathercards/weathercards.component';
import { DetailsComponent } from './components/details/details.component';
import { HttpClientModule } from '@angular/common/http';
import { ChartModule } from 'primeng/chart';

import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { StatComponentComponent } from './components/stat-component/stat-component.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    WeathercardsComponent,
    DetailsComponent,
    StatComponentComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ChartModule,
    DragDropModule
  ],
  providers: [
                {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}
              ],
  bootstrap: [AppComponent],
  exports: [],
})
export class AppModule { }
