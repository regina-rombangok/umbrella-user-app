import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyPromoPage } from './apply-promo.page';

describe('ApplyPromoPage', () => {
  let component: ApplyPromoPage;
  let fixture: ComponentFixture<ApplyPromoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplyPromoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyPromoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
