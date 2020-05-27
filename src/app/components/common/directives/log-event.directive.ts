import { Directive, HostListener, Input } from '@angular/core';
import { EventLoggerService } from 'src/app/services/event-logger.service';

@Directive({
  selector: '[appLogEvent]',
})
export class LogEventDirective {
  @Input('localId') id: string;
  @Input('parentId') parent: string;
  @Input('component') component: string;

  constructor(private eventLoggerSerice: EventLoggerService) {}
  @HostListener('click', ['$event']) onMouseClick($event: Event) {
    console.log(`${this.id}:${this.parent}:${this.component}`);
    this.eventLoggerSerice.addNewEvent(
      'click',
      `${this.id}:${this.parent}:${this.component}`
    );
  }
  @HostListener('select', ['$event']) onSelect($event: Event) {
    console.log(`${this.id}:${this.parent}:${this.component}`);
    this.eventLoggerSerice.addNewEvent(
      'select',
      `${this.id}:${this.parent}:${this.component}`
    );
  }
}
