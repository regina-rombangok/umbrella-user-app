import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestingPage } from './requesting.page';

describe('RequestingPage', () => {
  let component: RequestingPage;
  let fixture: ComponentFixture<RequestingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
