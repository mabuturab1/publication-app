import {
  DISCOVERY_FILTER,
  HISTOGRAM_DATA,
} from './../../../services/getServerData.service';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { SelectItem } from 'primeng/api/selectitem';
import { faEraser, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-filter-dialog',
  templateUrl: './filter-dialog.component.html',
  styleUrls: ['./filter-dialog.component.scss'],
})
export class FilterDialogComponent implements OnInit, OnChanges {
  faTimes = faTimes;
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
  baseWidth = 340;
  width = '340px';
  @Output() filterResults = new EventEmitter<any>();
  @Input() showExclude = true;
  @Input() initFilter: DISCOVERY_FILTER = {};
  @Input() histogram: HISTOGRAM_DATA;
  @Input() componentName: string;
  @Output() close = new EventEmitter<boolean>();

  constructor() {}
  // dialogClicked(event: Event) {
  //   event.stopPropagation();
  // }
  ngOnInit(): void {
    this.initFilterValues();
    if (this.histogram != null) this.updateHistogramData();
  }
  updateHistogramData() {
    if (this.histogram == null) return;
    this.dates = [];
    this.xAxisData = [];
    this.yAxisData = [];
    let minDate =
      this.histogram && this.histogram.year && this.histogram.year.min
        ? this.histogram.year.min
        : 1940;
    let maxDate =
      this.histogram && this.histogram.year && this.histogram.year.max
        ? this.histogram.year.max
        : 2018;

    this.selectedFromDate = minDate.toString();
    this.selectedToDate = maxDate.toString();
    this.prevSelectedFrom = minDate;
    this.prevSelectedTo = maxDate;

    for (let i = this.histogram.year.min; i <= maxDate; i++) {
      this.dates.push({
        label: i.toString(),
        value: i.toString(),
      });
      this.xAxisData.push(i);
      if (this.histogram.year && this.histogram.year.y)
        this.yAxisData.push(this.histogram.year.y[i - this.histogram.year.min]);
      else this.yAxisData.push(0);
    }

    this.width = Math.max(this.baseWidth, this.dates.length * 4 + 40) + 'px';
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let propName in changes) {
      let change = changes[propName];
      switch (propName) {
        case 'initFilter':
          this.initFilterValues();
          break;
        case 'histogram':
          this.updateHistogramData();
          break;
      }
    }
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
      exclude_keywords: this.excludeKeywords,
      // cutOff: 200,
    };
    if (this.showExclude) {
      filter = {
        ...filter,

        exclude_in_refs: this.excludeCited,
        exclude_out_refs: this.excludeCiting,
      };
    }
    this.filterResults.emit(filter);
  }
  closeClicked() {
    this.close.emit(true);
  }
}
