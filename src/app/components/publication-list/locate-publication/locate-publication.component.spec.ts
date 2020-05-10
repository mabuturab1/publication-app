import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocatePublicationComponent } from './locate-publication.component';

describe('LocatePublicationComponent', () => {
  let component: LocatePublicationComponent;
  let fixture: ComponentFixture<LocatePublicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocatePublicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocatePublicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
