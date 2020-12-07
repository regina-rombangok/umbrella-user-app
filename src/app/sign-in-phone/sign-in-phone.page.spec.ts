import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInPhonePage } from './sign-in-phone.page';

describe('SignInPhonePage', () => {
  let component: SignInPhonePage;
  let fixture: ComponentFixture<SignInPhonePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignInPhonePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignInPhonePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
