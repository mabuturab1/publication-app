import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-new-list',
  templateUrl: './new-list.component.html',
  styleUrls: ['./new-list.component.scss'],
})
export class NewListComponent implements OnInit {
  @Input() name: string = '';
  subtitle: string;
  @Output() listData = new EventEmitter<any>();
  constructor() {}

  ngOnInit(): void {}
  saveButtonClicked() {
    this.listData.emit({ name: this.name, subtitle: this.subtitle });
  }
}
