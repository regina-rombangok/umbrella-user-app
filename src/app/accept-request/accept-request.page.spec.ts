import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptRequestPage } from './accept-request.page';

describe('AcceptRequestPage', () => {
  let component: AcceptRequestPage;
  let fixture: ComponentFixture<AcceptRequestPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcceptRequestPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptRequestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
