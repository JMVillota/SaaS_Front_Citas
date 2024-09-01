import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'full-calendar', data:{ breadcrumb: 'Full Calendar'}, loadChildren: () => import('./full-calendar/full-calendar.module').then(m => m.FullCalendarModule_p) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class UIkitRoutingModule { }
