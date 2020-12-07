import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OTPVerificationPage } from './otpverification.page';

describe('OTPVerificationPage', () => {
  let component: OTPVerificationPage;
  let fixture: ComponentFixture<OTPVerificationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OTPVerificationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OTPVerificationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
