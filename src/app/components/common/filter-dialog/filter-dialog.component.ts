import { DISCOVERY_FILTER } from './../../../services/getServerData.service';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';
import { SelectItem } from 'primeng/api/selectitem';
import { faEraser, faCheck } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-filter-dialog',
  templateUrl: './filter-dialog.component.html',
  styleUrls: ['./filter-dialog.component.scss'],
})
export class FilterDialogComponent implements OnInit, OnChanges {
  selectedFromDate = '1940';
  selectedToDate = '2018';
  prevSelectedFrom = 1940;
  prevSelectedTo = 2018;
  faEraser = faEraser;
  faCheck = faCheck;
  dates: SelectItem[] = [];
  excludeCited = false;
  excludeCiting = false;
  excludeKeywords = '';
  xAxisData = [];
  yAxisData = [];
  @Output() filterResults = new EventEmitter<any>();
  @Input() showExclude = true;
  @Input() initFilter: DISCOVERY_FILTER = {};
  constructor() {}
  // dialogClicked(event: Event) {
  //   event.stopPropagation();
  // }
  ngOnInit(): void {
    this.initFilterValues();
    for (let i = 1940; i < 2019; i++) {
      this.dates.push({
        label: i.toString(),
        value: i.toString(),
      });

      this.xAxisData.push(i);
      this.yAxisData.push(Math.round(Math.random() * 20 + 1));
    }
  }
  ngOnChanges() {
    this.initFilterValues();
  }
  initFilterValues() {
    if (this.initFilter == null) return;
    if (this.initFilter.year_end != null)
      this.selectedToDate = this.initFilter.year_end.toString();
    if (this.initFilter.year_start != null)
      this.selectedFromDate = this.initFilter.year_start.toString();
    if (this.initFilter.exclude_in_refs != null)
      this.excludeCited = this.initFilter.exclude_in_refs;
    if (this.initFilter.exclude_out_refs != null)
      this.excludeCiting = this.initFilter.exclude_out_refs;
    if (this.initFilter.exclude_keywords != null)
      this.excludeKeywords = this.initFilter.exclude_keywords;
  }
  excludeCitedChanged(event: any) {
    this.excludeCited = event.target.checked;
  }
  excludeCitingChanged(event: any) {
    this.excludeCiting = event.target.checked;
  }
  updatePrevDate(event: number) {
    this.selectedFromDate = event.toString();
  }
  updateNextDate(event: number) {
    this.selectedToDate = event.toString();
  }
  getMinNumber(str: string) {
    if (this.xAxisData.includes(Number(str))) {
      this.prevSelectedFrom = Number(str);
    }
    return this.prevSelectedFrom;
  }
  getMaxNumber(str: string) {
    if (this.xAxisData.includes(Number(str))) {
      this.prevSelectedTo = Number(str);
    }
    return this.prevSelectedTo;
  }
  onApplyCliked() {
    let filter: any = {
      year_start: Number(this.selectedFromDate),
      year_end: Number(this.selectedToDate),

      // cutOff: 200,
    };
    if (this.showExclude) {
      filter = {
        ...filter,
        exclude_keywords: this.excludeKeywords,
        exclude_in_refs: this.excludeCited,
        exclude_out_refs: this.excludeCiting,
      };
    }
    this.filterResults.emit(filter);
  }
}
