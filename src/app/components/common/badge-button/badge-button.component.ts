import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-badge-button',
  templateUrl: './badge-button.component.html',
  styleUrls: ['./badge-button.component.scss'],
})
export class BadgeButtonComponent implements OnInit {
  @Input() buttonLabel = '';
  @Output() buttonClicked = new EventEmitter<boolean>();
  @Input() textColor = '#ffffff';
  @Input() buttonAfterText: string = '';
  constructor() {}

  ngOnInit(): void {}
  onButtonClicked() {
    this.buttonClicked.emit(true);
  }
}
