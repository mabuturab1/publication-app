import { PublicationDataService } from 'src/app/services/publication-data.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EventLoggerService {
  currentEvents: any[] = [];
  constructor(private publicationService: PublicationDataService) {}
  addNewEvent(action: string, event: string) {
    this.currentEvents.push(
      JSON.stringify({
        element: {
          dom: event,
          ng: event,
        },
        event: {
          dom: { name: action, data: {} },
          ng: action,
        },
        state: this.publicationService.getStateObject(),
        timeStamp: new Date().toISOString(),
      })
    );
  }
  clearEventList() {
    this.currentEvents = [];
  }
  getEventList() {
    return this.currentEvents;
  }
}
