import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-sort-button',
  templateUrl: './sort-button.component.html',
  styleUrls: ['./sort-button.component.scss'],
})
export class SortButtonComponent implements OnInit {
  @Input() buttonLabel = 'Sort';
  @Input() list = ['Closeness', 'Date'];
  @Input() values = ['closeness', 'date'];
  @Input() componentName: string;
  @Output() sortType = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}
  sortTypeChanged(event) {
    this.sortType.emit(event);
  }
}
