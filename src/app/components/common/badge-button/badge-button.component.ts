import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  HostListener,
} from '@angular/core';
import { OverlayPanel } from 'primeng/overlaypanel/public_api';

@Component({
  selector: 'app-badge-button',
  templateUrl: './badge-button.component.html',
  styleUrls: ['./badge-button.component.scss'],
})
export class BadgeButtonComponent implements OnInit {
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
  @Input() windowWidth: number;
  innerWidth = 0;
  constructor() {
    this.innerWidth = window.innerWidth;
  }

  ngOnInit(): void {}
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
  getWidth(element: HTMLButtonElement) {
    let pos = this.tooltipButton.nativeElement.getBoundingClientRect().x;
    if (!pos) return '300px';
    let widthToConsider = this.innerWidth;
    if (this.windowWidth) widthToConsider = this.windowWidth;

    let returnWidth = Math.min(300, widthToConsider - pos);
    console.log(pos, widthToConsider, widthToConsider - pos);
    return returnWidth.toString() + 'px';
  }
}
