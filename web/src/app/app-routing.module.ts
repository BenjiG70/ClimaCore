import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { StatComponentComponent } from './components/stat-component/stat-component.component';

const routes: Routes = [
  {path: '', component:LandingComponent},
  {path: 'home', component:LandingComponent},
  {path: 'stats', component:StatComponentComponent},
  {path: 'stats/:sensor', component:StatComponentComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
