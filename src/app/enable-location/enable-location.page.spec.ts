import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnableLocationPage } from './enable-location.page';

describe('EnableLocationPage', () => {
  let component: EnableLocationPage;
  let fixture: ComponentFixture<EnableLocationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnableLocationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnableLocationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
