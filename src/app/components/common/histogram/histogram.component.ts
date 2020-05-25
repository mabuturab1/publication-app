import {
  Component,
  OnInit,
  Input,
  HostListener,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';
import { faSortDown } from '@fortawesome/free-solid-svg-icons';
import { Options, LabelType } from 'ng5-slider';
@Component({
  selector: 'app-histogram',
  templateUrl: './histogram.component.html',
  styleUrls: ['./histogram.component.scss'],
})
export class HistogramComponent implements OnInit, OnChanges {
  prevCursorActive = false;
  nextCursorActive = false;
  @Input() minValue: number = 0;
  @Input() maxValue: number = 0;
  udpateData = true;
  @Input() xAxisData: number[] = [];
  @Input() yAxisData: number[] = [];
  yData: number[] = [];
  @Output() prevDateChanged = new EventEmitter<number>();
  @Output() nextDataChanged = new EventEmitter<number>();
  faSortDown = faSortDown;
  options: Options = {
    step: 1,

    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return "<span style='color:white'>'+value.toString()+'</span>";
        case LabelType.High:
          return value.toString();
        default:
          return value.toString();
      }
    },
  };
  startSending(data: boolean) {
    this.udpateData = data;
  }
  datesChanged($event) {
    this.prevDateChanged.emit(this.minValue);
    this.nextDataChanged.emit(this.maxValue);
  }
  constructor() {}

  ngOnInit(): void {
    this.normalizeYData();
    this.initOptions();
  }
  initOptions() {
    this.options = {
      step: 1,
      floor: this.xAxisData[0],
      ceil: this.xAxisData[this.xAxisData.length - 1],
      translate: (value: number, label: LabelType): string => {
        switch (label) {
          case LabelType.Low:
            return value.toString();
          case LabelType.High:
            return value.toString();
          default:
            return value.toString();
        }
      },
    };
  }
  normalizeYData() {
    this.yData = [];
    let max = 0;
    this.yAxisData.forEach((el) => {
      if (el > max) max = el;
    });
    for (let i = 0; i < this.yAxisData.length; i++) {
      this.yData.push(Math.round((this.yAxisData[i] / max) * 20) + 1);
    }
  }
  ngOnChanges() {
    this.normalizeYData();
    this.initOptions();
  }
  getPixels(item: number) {
    return item + 'px';
  }
  getActiveStatus(index: number) {
    if (
      this.xAxisData[index] >= this.minValue &&
      this.xAxisData[index] <= this.maxValue
    )
      return true;
    else return false;
  }
}
