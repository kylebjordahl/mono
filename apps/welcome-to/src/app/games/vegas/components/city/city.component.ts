import { Component } from '@angular/core'
import { Store } from '@ngrx/store'
import {
  Lot,
  StreetAvenueAddress,
  Property,
  HotelSize,
} from '../../state/properties/properties.models'
import * as fromProperties from '../../state/properties/properties.selectors'
import * as fromLimo from '../../state/limo/limo.selectors'
import * as PropertyActions from '../../state/properties/properties.actions'
import * as GameActions from '../../state/game/game.actions'
import { equals } from 'ramda'

@Component({
  selector: 'vegas-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.scss'],
})
export class CityComponent {
  public HotelSize = HotelSize
  lots$ = this.store.select(fromProperties.selectLots)
  currentLimo$ = this.store.select(fromLimo.selectLimoLocation)
  hotel$= this.store.select(fromProperties.selectHotels)

  equals = equals

  constructor(private readonly store: Store) {
  }

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

  onHotelUnavailable(avenue: number){
    this.store.dispatch(PropertyActions.changeHotelAvailability({avenue, available: HotelSize.Partial}))
  }

}
