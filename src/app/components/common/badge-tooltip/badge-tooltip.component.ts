import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-badge-tooltip',
  templateUrl: './badge-tooltip.component.html',
  styleUrls: ['./badge-tooltip.component.scss'],
})
export class BadgeTooltipComponent implements OnInit {
  @Input() buttonLabel = '';
  @Input() tooltipText: string;
  constructor() {}

  ngOnInit(): void {
    console.log('button label is', this.buttonLabel);
  }
}
