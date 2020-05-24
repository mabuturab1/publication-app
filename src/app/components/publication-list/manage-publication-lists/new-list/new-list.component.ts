import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { faSave, faBan } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-new-list',
  templateUrl: './new-list.component.html',
  styleUrls: ['./new-list.component.scss'],
})
export class NewListComponent implements OnInit {
  @Input() name: string = '';
  faSave = faSave;
  faBan = faBan;
  subtitle: string;
  @Output() listData = new EventEmitter<any>();
  constructor() {}

  ngOnInit(): void {}
  saveButtonClicked() {
    this.listData.emit({ name: this.name, subtitle: this.subtitle });
  }
  cancelButtonClicked() {
    this.listData.emit(null);
  }
}
