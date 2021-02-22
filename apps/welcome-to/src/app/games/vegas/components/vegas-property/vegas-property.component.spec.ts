import { ComponentFixture, TestBed } from '@angular/core/testing'

import { VegasPropertyComponent } from './vegas-property.component'

describe('VegasPropertyComponent', () => {
  let component: VegasPropertyComponent
  let fixture: ComponentFixture<VegasPropertyComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VegasPropertyComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(VegasPropertyComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
