import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishedPage } from './finished.page';

describe('FinishedPage', () => {
  let component: FinishedPage;
  let fixture: ComponentFixture<FinishedPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinishedPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinishedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
