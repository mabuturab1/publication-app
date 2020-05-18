import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appEventBlocker]',
})
export class EventBlockerDirective {
  constructor() {}
  @HostListener('click', ['$event']) onMouseClick($event: Event) {
    $event.stopPropagation();
  }
}
