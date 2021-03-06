import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VegasBlockComponent } from './vegas-block.component';

describe('VegasBlockComponent', () => {
  let component: VegasBlockComponent;
  let fixture: ComponentFixture<VegasBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VegasBlockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VegasBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
