import { Component } from '@angular/core'
import { Store } from '@ngrx/store'
import {
  Lot,
  LotAddress,
  Property,
} from '../../state/properties/properties.models'
import * as fromProperties from '../../state/properties/properties.selectors'
import * as PropertyActions from '../../state/properties/properties.actions'
import * as GameActions from '../../state/game/game.actions'

@Component({
  selector: 'vegas-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.scss'],
})
export class CityComponent {
  grid$ = this.store.select(fromProperties.selectCityGrid)
  lots$ = this.store.select(fromProperties.selectLots)

  constructor(private readonly store: Store) {}

  placeLotOnGrid(lot: Lot): { gridColumn: number; gridRow: number } {
    try {
      return {
        gridColumn: lot?.address.avenue,
        gridRow: lot?.address.street,
      }
    } catch (err) {
      console.log(err, lot)
    }
  }

  onReset() {
    this.store.dispatch(GameActions.reset())
  }
}
