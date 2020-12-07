import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationAddressPage } from './location-address.page';

describe('LocationAddressPage', () => {
  let component: LocationAddressPage;
  let fixture: ComponentFixture<LocationAddressPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationAddressPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationAddressPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
