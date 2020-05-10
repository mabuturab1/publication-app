import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { faAngleDown, faFileExport } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-dropdown-button',
  templateUrl: './dropdown-button.component.html',
  styleUrls: ['./dropdown-button.component.scss'],
})
export class DropdownButton implements OnInit {
  @Output() itemSelected = new EventEmitter<string>();
  @Input() buttonLabel = '';
  @Input() dropdownList: string[] = [];
  @Input() showMaterialSelect = false;
  @Input() icon: any;
  @Input() fullWidth = false;
  @Input() placeholderText: string;
  @Input() smallPadding = false;
  showDialog = false;
  faFileExport = faFileExport;
  toggleDetailDialog() {
    this.showDialog = !this.showDialog;
  }
  viewTypeChanged(event: string) {
    this.buttonLabel = event;
    this.itemSelected.emit(event);
    this.showDialog = false;
  }
  matDropdownChanged() {
    this.itemSelected.emit(this.buttonLabel);
  }
  faAngleDown = faAngleDown;
  constructor() {}

  ngOnInit(): void {}
}
