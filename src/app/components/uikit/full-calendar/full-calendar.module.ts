import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarRoutingModule } from './full-calendar-routing.module';
import { FullCalendarComponent } from './full-calendar.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@NgModule({
  
  imports: [
    CommonModule,
    FullCalendarRoutingModule,
    FullCalendarModule,
    DialogModule,
    ButtonModule
    
  ],
  declarations: [FullCalendarComponent]
})
export class FullCalendarModule_p { }
