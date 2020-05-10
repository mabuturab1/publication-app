import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleListComponentComponent } from './single-list-component.component';

describe('SingleListComponentComponent', () => {
  let component: SingleListComponentComponent;
  let fixture: ComponentFixture<SingleListComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleListComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleListComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
