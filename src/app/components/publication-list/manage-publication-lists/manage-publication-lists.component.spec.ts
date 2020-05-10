import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePublicationListsComponent } from './manage-publication-lists.component';

describe('ManagePublicationListsComponent', () => {
  let component: ManagePublicationListsComponent;
  let fixture: ComponentFixture<ManagePublicationListsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManagePublicationListsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePublicationListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
