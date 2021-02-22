import { Component, EventEmitter, Input, Output } from '@angular/core'
import { Store } from '@ngrx/store'
import { LotAddress, Property } from '../../state/properties/properties.models'

import * as PropertyActions from '../../state/properties/properties.actions'

@Component({
  selector: 'vegas-property',
  templateUrl: './vegas-property.component.html',
  styleUrls: ['./vegas-property.component.scss'],
})
export class VegasPropertyComponent {
  @Input()
  property: Property

  @Input()
  address: LotAddress

  constructor(private readonly store: Store) {}

  onCasinoNumberAssign(event: Event): void {
    try {
      const casinoNumber = Number((event.target as HTMLInputElement).value)
      this.store.dispatch(
        PropertyActions.openCasino({
          address: this.address,
          casinoNumber,
        })
      )
    } catch (err) {
      console.warn(err)
    }
  }

  onCasinoNumberUnassign(): void {
    if (!this.property.casinoNumber) {
      return
    }

    this.store.dispatch(
      PropertyActions.resetCasino({
        address: this.address,
      })
    )
  }

  onPropertyBuild(): void {
    this.store.dispatch(
      PropertyActions.constructProperty({ address: this.address })
    )
  }

  onOpenShow(): void {
    this.store.dispatch(PropertyActions.openShow({ address: this.address }))
  }
}
