import {
  Directive,
  HostListener,
  ElementRef,
  Output,
  EventEmitter,
} from '@angular/core';

@Directive({
  selector: '[appHideMe]',
})
export class HideMeDirective {
  wasInside = false;
  @Output() documentClicked = new EventEmitter<boolean>();
  constructor(private el: ElementRef) {}
  @HostListener('mousedown')
  clickInside() {
    this.wasInside = true;
  }
  @HostListener('document:mousedown', ['$event']) onMouseClick($event: Event) {
    if (!this.wasInside) this.documentClicked.emit(true);
    this.wasInside = false;
  }
  @HostListener('document:keydown.escape', ['$event']) handleKeyboardEvent(
    $event: KeyboardEvent
  ) {
    this.documentClicked.emit(true);
  }
}
