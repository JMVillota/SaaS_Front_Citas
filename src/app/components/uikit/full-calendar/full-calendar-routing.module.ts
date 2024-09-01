import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FullCalendarComponent } from './full-calendar.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '',component: FullCalendarComponent }
    ])],
    exports: [RouterModule]
})
export class FullCalendarRoutingModule { }