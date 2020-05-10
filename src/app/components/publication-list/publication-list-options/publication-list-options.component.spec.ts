import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicationListOptionsComponent } from './publication-list-options.component';

describe('PublicationListOptionsComponent', () => {
  let component: PublicationListOptionsComponent;
  let fixture: ComponentFixture<PublicationListOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicationListOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicationListOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
