import { Directive, HostListener } from '@angular/core';
import { EventLoggerService } from 'src/app/services/event-logger.service';

@Directive({
  selector: '[appLogEvent]',
})
export class LogEventDirective {
  constructor(private eventLoggerSerice: EventLoggerService) {}
  @HostListener('click', ['$event']) onMouseClick($event: Event) {
    console.log(event);
    this.eventLoggerSerice.addNewEvent($event);
  }
}
