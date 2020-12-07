import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapViewPage } from './map-view.page';

describe('MapViewPage', () => {
  let component: MapViewPage;
  let fixture: ComponentFixture<MapViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapViewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
