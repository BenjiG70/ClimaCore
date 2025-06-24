import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { StatComponentComponent } from './components/stat-component/stat-component.component';
import { ErrorComponent } from './components/error/error.component';

const routes: Routes = [
  {path: '', component:LandingComponent},
  {path: 'home', component:LandingComponent},
  {path: 'stats', component:StatComponentComponent},
  {path: 'stats/:sensor', component:StatComponentComponent},
  {path: '**', component: ErrorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
