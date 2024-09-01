import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CalendarOptions, EventClickArg, EventDropArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import esLocale from '@fullcalendar/core/locales/es';
import { FullCalendarComponent as FullCalendarComponentCore } from '@fullcalendar/angular';

@Component({
  selector: 'app-full-calendar',
  templateUrl: './full-calendar.component.html',
  styleUrls: ['./full-calendar.component.scss']
})
export class FullCalendarComponent implements OnInit, OnDestroy {
  @ViewChild('calendar') calendarComponent: FullCalendarComponentCore;

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
    initialView: 'dayGridMonth',
    locale: esLocale,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
    },
    events: [
      { title: 'Reunión importante', start: '2024-07-10', description: 'Discutir los detalles del nuevo proyecto.' },
      { title: 'Entrega de proyecto', start: '2024-07-15', end: '2024-07-17', description: 'Presentar la versión final del software.' },
      { title: 'Visita al cliente', start: '2024-07-20T10:30:00', end: '2024-07-20T12:30:00', description: 'Reunión con el cliente para revisar el progreso.' }
    ],
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this),
    editable: true,
    eventDrop: this.handleEventDrop.bind(this),
    height: 'auto'
  };

  displayDialog: boolean = false;
  selectedEvent: any;

  ngOnInit() {
    this.setCalendarView();
    window.addEventListener('resize', this.setCalendarView.bind(this));
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.setCalendarView);
  }

  setCalendarView() {
    const api = this.calendarComponent?.getApi();
    if (api) {
      if (window.innerWidth < 768) {
        api.changeView('listMonth');
        api.setOption('headerToolbar', {
          left: 'prev,next',
          center: 'title',
          right: 'dayGridMonth,listMonth'
        });
      } else {
        api.changeView('dayGridMonth');
        api.setOption('headerToolbar', {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
        });
      }
    }
  }

  handleDateClick(arg: DateClickArg) {
    this.displayDialog = true;
    this.selectedEvent = { title: 'Nuevo Evento', start: arg.dateStr, description: 'Descripción del nuevo evento.' };
  }

  handleEventClick(arg: EventClickArg) {
    this.displayDialog = true;
    this.selectedEvent = arg.event;
  }

  handleEventDrop(arg: EventDropArg) {
    console.log('Evento arrastrado desde ' + arg.oldEvent.startStr + ' a ' + arg.event.startStr);
  }

  closeDialog() {
    this.displayDialog = false;
  }
}