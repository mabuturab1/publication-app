import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-dropdown-list',
  templateUrl: './dropdown-list.component.html',
  styleUrls: ['./dropdown-list.component.scss'],
})
export class DropdownListComponent implements OnInit {
  @Output() typeChanged = new EventEmitter<string>();
  @Input() list: string[] = [];
  constructor() {}

  ngOnInit(): void {}
  typeValChanged(name: string) {
    this.typeChanged.emit(name);
  }
}
