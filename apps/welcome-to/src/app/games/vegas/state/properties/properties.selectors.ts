import { createFeatureSelector, createSelector } from '@ngrx/store'
import * as R from 'ramda'
import { PartialLimoState } from '../limo/limo.reducer'
import {
  selectCurrentDrive,
  selectNextRoads,
  selectVisitedRoads,
} from '../limo/limo.selectors'
import { allRoads, intersections } from './initialProperties'
import { Lot, StreetAvenueAddress, Property } from './properties.models'
import {
  PartialPropertiesState,
  PROPERTIES_FEATURE_KEY,
  State,
} from './properties.reducer'

// Lookup the 'Properties' feature state managed by NgRx
export const selectPropertiesFeature = createFeatureSelector<
  PartialPropertiesState & PartialLimoState,
  State
>(PROPERTIES_FEATURE_KEY)

export const selectLots = createSelector(
  selectPropertiesFeature,
  selectNextRoads,
  selectVisitedRoads,
  selectCurrentDrive,
  (state, nextRoads, visitedRoads, currentDrive) => {
    return state.lots.map((lot) => {
      const street = allRoads.find(
        (r) => r.orientation === 'STREET' && R.equals(lot.address, r.address)
      )
      const avenue = allRoads.find(
        (r) => r.orientation === 'AVENUE' && R.equals(lot.address, r.address)
      )
      return {
        ...lot,
        roads: {
          street: street
            ? {
                ...street,
                driveable: !!nextRoads.find((r) => r.id === street.id),
                visited: !!visitedRoads.find((r) => r.id === street.id),
                onCurrentDrive: !!currentDrive?.find((r) => r.id === street.id),
              }
            : undefined,
          avenue: avenue
            ? {
                ...avenue,
                driveable: !!nextRoads.find((r) => r.id === avenue.id),
                visited: !!visitedRoads.find((r) => r.id === avenue.id),
                onCurrentDrive: !!currentDrive?.find((r) => r.id === avenue.id),
              }
            : undefined,
        },
        intersection: intersections?.find((i) =>
          R.equals(i.address, lot.address)
        ),
      }
    })
  }
)

export const selectProperties = createSelector(selectLots, (lots) =>
  lots.reduce(
    (properties, lot) =>
      lot.property ? properties.concat([lot.property]) : properties,
    []
  )
)

export const selectPropertyByAddress = (address: StreetAvenueAddress) =>
  createSelector(selectLots, (lots) =>
    lots.find((l) => R.equals(l.address, address))
  )

export const selectCityGrid = createSelector(
  selectLots,
  (lots) =>
    R.compose(
      R.values,
      R.groupBy<Lot>((x) => x.address.street.toFixed())
    )(lots) as Lot[][]
)

export const selectHotels = createSelector(
  selectPropertiesFeature,
  (state) => state.hotels
)
