import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentPublicationListComponent } from './current-publication-list.component';

describe('CurrentPublicationListComponent', () => {
  let component: CurrentPublicationListComponent;
  let fixture: ComponentFixture<CurrentPublicationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentPublicationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentPublicationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
