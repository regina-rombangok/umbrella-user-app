import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInOptionPage } from './sign-in-option.page';

describe('SignInOptionPage', () => {
  let component: SignInOptionPage;
  let fixture: ComponentFixture<SignInOptionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignInOptionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignInOptionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
