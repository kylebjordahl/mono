import { Injectable } from '@angular/core'
import { createEffect, Actions, ofType } from '@ngrx/effects'
import { Action, Store } from '@ngrx/store'

import { map, switchMap, withLatestFrom } from 'rxjs/operators'
import * as PropertiesActions from './properties.actions'
import * as fromProperties from './properties.selectors'
import * as R from 'ramda'
import {  from, of } from 'rxjs'

@Injectable()
export class PropertiesEffects {
  openCasino$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PropertiesActions.openCasino),
      withLatestFrom(this.store.select(fromProperties.selectLots)),
      switchMap(([{ address, casinoNumber }, lots]) => {
        // casino number constraints
        const emptyResponse = of(PropertiesActions.updateProperty({
          address,
          property: {
          },
        }))

        if (casinoNumber > 17 || casinoNumber < 0) {
          return emptyResponse
        }

        const thisStreet = lots
          .filter((l) => l.address.street === address.street)
          .sort((a, b) => a.address.avenue - b.address.avenue)

        const leftOfAddress = thisStreet.filter(
          (l) => l.address.avenue < address.avenue && l.property?.isConstructed
        )
        const rightOfAddress = thisStreet.filter(
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
          return emptyResponse
        }
        if (
          !rightOfAddress.every(
            (l) =>
              !l.property?.casinoNumber ||
              l.property?.casinoNumber > casinoNumber
          )
        ) {
          return emptyResponse
        }

        const lotIndex = thisStreet.findIndex((l) =>
          R.equals(l.address, address)
        )
        const lot = thisStreet[lotIndex]

        // GOLF
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
        const updates: Action[] = [updateAction]
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

        // check for hotel completion
        const thisAvenue = lots.filter(l=>l.address.avenue===address.avenue)

        if(thisAvenue.every(l=>l.property?.casinoNumber || R.equals(l, lot))){
          updates.push(
            PropertiesActions.openHotel({avenue: address.avenue})
          )
        }

        return from(updates)
      })
    )
  )

  constructor(private actions$: Actions, private readonly store: Store) {}
}
