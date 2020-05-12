import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgeTooltipComponent } from './badge-tooltip.component';

describe('BadgeTooltipComponent', () => {
  let component: BadgeTooltipComponent;
  let fixture: ComponentFixture<BadgeTooltipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BadgeTooltipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BadgeTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
