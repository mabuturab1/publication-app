import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { OverlayPanel } from 'primeng/overlaypanel/public_api';

@Component({
  selector: 'app-badge-button',
  templateUrl: './badge-button.component.html',
  styleUrls: ['./badge-button.component.scss'],
})
export class BadgeButtonComponent implements OnInit {
  @ViewChild('panel', { static: false }) overlayPanel: OverlayPanel;
  @Input() buttonLabel = '';
  @Input() isTag = false;
  @Output() buttonClicked = new EventEmitter<boolean>();
  @Input() textColor = '#ffffff';
  @Input() buttonAfterText: string = '';
  @Input() tooltipText: string;
  @Input() type: string;
  constructor() {}

  ngOnInit(): void {}
  onButtonClicked(event: Event) {
    this.buttonClicked.emit(true);
    console.log(this.overlayPanel);
    if (this.overlayPanel && this.tooltipText) this.overlayPanel.toggle(event);
  }
  getClass() {
    let val = {};
    val[this.type] = this.type != null;
    return val;
  }
}
