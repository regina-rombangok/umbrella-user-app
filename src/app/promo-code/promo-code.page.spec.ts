import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoCodePage } from './promo-code.page';

describe('PromoCodePage', () => {
  let component: PromoCodePage;
  let fixture: ComponentFixture<PromoCodePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromoCodePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromoCodePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
