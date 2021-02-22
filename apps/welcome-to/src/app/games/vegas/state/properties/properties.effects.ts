import { Injectable } from '@angular/core'
import { createEffect, Actions, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'

import { map, switchMap, withLatestFrom } from 'rxjs/operators'
import * as PropertiesActions from './properties.actions'
import * as fromProperties from './properties.selectors'
import * as R from 'ramda'
import { from } from 'rxjs'

@Injectable()
export class PropertiesEffects {
  openCasino$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PropertiesActions.openCasino),
      withLatestFrom(this.store.select(fromProperties.selectLots)),
      switchMap(([{ address, casinoNumber }, lots]) => {
        // casino number constraints
        if (casinoNumber > 17 || casinoNumber < 0) {
          return null
        }

        const thisStreet = lots
          .filter((l) => l.address.street === address.street)
          .sort((a, b) => a.address.avenue - b.address.avenue)

        const leftOfAddress = thisStreet.filter(
          (l) => l.address.avenue < address.avenue && l.property?.isConstructed
        )
        const rightOfAddress = lots.filter(
          (l) => l.address.avenue > address.avenue && l.property?.isConstructed
        )

        // confirm sequential order of casinoNumbers
        if (
          !leftOfAddress.every(
            (l) =>
              !l.property?.casinoNumber ||
              l.property?.casinoNumber < casinoNumber
          )
        ) {
          return null
        }
        if (
          !rightOfAddress.every(
            (l) =>
              !l.property?.casinoNumber ||
              l.property?.casinoNumber > casinoNumber
          )
        ) {
          return null
        }

        // Your custom service 'load' logic goes here. For now just return a success action...

        const lotIndex = thisStreet.findIndex((l) =>
          R.equals(l.address, address)
        )
        const lot = thisStreet[lotIndex]

        const lotsWithGolf = thisStreet.filter(
          (l) => l.property?.hasGolf && l.property.golfDefinition
        )

        const hasGolf =
          lot.property?.hasGolf ?? lotsWithGolf.length > 0
            ? // check the lots on either side to see if we connect
              lotsWithGolf.some(
                (l) =>
                  l.address.avenue === lot.address.avenue - 1 ||
                  l.address.avenue === lot.address.avenue + 1
              )
            : !!lot.property?.golfDefinition

        const updateAction = PropertiesActions.updateProperty({
          address,
          property: {
            casinoNumber,
            hasGolf,
          },
        })

        // if hasGolf was false and there are lotsWithGolf, that means we didn't connect,
        // so update all lots this side of the existing link
        const updates = [updateAction]
        if (!hasGolf && lotsWithGolf.length > 0) {
          // split the array over the lotsWithGolf, and keep the half that contains the lot
          const isAbove = lotsWithGolf.every(
            (l) => l.address.avenue < lot.address.avenue
          )
          const toCancel = isAbove
            ? thisStreet.filter((l) =>
                lotsWithGolf.every((g) => g.address.avenue < l.address.avenue)
              )
            : thisStreet.filter((l) =>
                lotsWithGolf.every((g) => g.address.avenue > l.address.avenue)
              )

          toCancel.forEach((l) =>
            updates.push(
              PropertiesActions.updateProperty({
                address: l.address,
                property: {
                  hasGolf: false,
                },
              })
            )
          )
        }

        return from(updates)
      })
    )
  )

  constructor(private actions$: Actions, private readonly store: Store) {}
}
