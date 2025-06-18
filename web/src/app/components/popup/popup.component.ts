import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss'
})
export class PopupComponent {
  formattedDate:any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    console.log('Sensor name:', data);
    this.formattedDate = new Date(Number(data.DATE_TIME)).toLocaleString();

  }  
  closeDialog(){
    
  }
}
