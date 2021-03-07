import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VegasComponent } from './vegas.component';

describe('VegasComponent', () => {
  let component: VegasComponent;
  let fixture: ComponentFixture<VegasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VegasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VegasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
