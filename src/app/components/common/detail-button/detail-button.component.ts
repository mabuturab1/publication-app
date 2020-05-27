import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-detail-button',
  templateUrl: './detail-button.component.html',
  styleUrls: ['./detail-button.component.scss'],
})
export class DetailButtonComponent implements OnInit {
  @Input() buttonLabel = '';
  list = ['Detailed', 'Compact'];
  @Input() smallPadding = false;
  @Input() componentName: string;

  constructor() {}
  @Output() showDetailedLook = new EventEmitter<boolean>();
  ngOnInit(): void {
    // this.viewTypeChanged(this.buttonLabel);
  }
  viewTypeChanged(event: string) {
    this.showDetailedLook.emit(event == 'Detailed');
  }
}
