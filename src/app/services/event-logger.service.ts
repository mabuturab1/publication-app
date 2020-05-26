import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EventLoggerService {
  currentEvents: string[] = [];
  constructor() {}
  addNewEvent(event: Event) {}
}
