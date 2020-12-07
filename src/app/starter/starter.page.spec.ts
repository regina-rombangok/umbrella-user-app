import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StarterPage } from './starter.page';

describe('StarterPage', () => {
  let component: StarterPage;
  let fixture: ComponentFixture<StarterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StarterPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StarterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
