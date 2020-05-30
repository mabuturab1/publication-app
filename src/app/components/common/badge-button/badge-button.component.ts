import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  HostListener,
  AfterViewInit,
} from '@angular/core';
import { OverlayPanel } from 'primeng/overlaypanel/public_api';

@Component({
  selector: 'app-badge-button',
  templateUrl: './badge-button.component.html',
  styleUrls: ['./badge-button.component.scss'],
})
export class BadgeButtonComponent implements OnInit, AfterViewInit {
  @ViewChild('panel', { static: false }) overlayPanel: OverlayPanel;
  @ViewChild('tooltipButton', { static: false })
  tooltipButton: ElementRef;

  @Input() buttonLabel = '';
  @Input() isTag = false;
  @Output() buttonClicked = new EventEmitter<boolean>();
  @Input() textColor = '#ffffff';
  @Input() buttonAfterText: string = '';
  @Input() tooltipText: string;
  @Input() type: string;
  @Input() windowWidthpx: number;
  overlayPanelWidth = 300;

  innerWidth = 0;
  constructor() {
    this.innerWidth = window.innerWidth;
  }

  ngOnInit(): void {}
  ngAfterViewInit() {
    if (this.windowWidthpx) this.updateWidth();
  }
  updateWidth() {
    let pos = this.tooltipButton.nativeElement.getBoundingClientRect();

    if (pos) {
      let x = pos.x;

      if (x + this.overlayPanelWidth + 60 > this.windowWidthpx) {
        this.overlayPanelWidth = this.windowWidthpx - x - 60;
      }
    }
  }
  onButtonClicked(event: Event) {
    this.buttonClicked.emit(true);

    if (this.overlayPanel && this.tooltipText) this.overlayPanel.toggle(event);
  }
  getClass() {
    let val = {};
    val[this.type] = this.type != null;
    return val;
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }
}
