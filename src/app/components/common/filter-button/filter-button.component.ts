import {
  DISCOVERY_FILTER,
  HISTOGRAM_DATA,
} from './../../../services/getServerData.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-filter-button',
  templateUrl: './filter-button.component.html',
  styleUrls: ['./filter-button.component.scss'],
})
export class FilterButtonComponent implements OnInit {
  showFilterDialog = false;
  faAngleDown = faAngleDown;
  @Input() showExlcude = true;
  @Input() filter: DISCOVERY_FILTER = {};
  @Input() histogram: HISTOGRAM_DATA;
  @Input() componentName: string;
  @Output() filterResults = new EventEmitter<any>();
  constructor() {}
  filterDialogButtonClicked(event: any) {
    this.showFilterDialog = !this.showFilterDialog;
    event.stopPropagation();
  }
  ngOnInit(): void {}
  filterResultsChanged(event) {
    this.showFilterDialog = false;

    this.filterResults.emit(event);
  }
  closeDialog(event: boolean) {
    if (event) {
      this.showFilterDialog = false;
    }
  }
}
