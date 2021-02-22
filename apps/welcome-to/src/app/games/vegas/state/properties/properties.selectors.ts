import { createFeatureSelector, createSelector } from '@ngrx/store'
import * as R from 'ramda'
import { Lot, LotAddress, Property } from './properties.models'
import {
  PartialPropertiesState,
  PROPERTIES_FEATURE_KEY,
  State,
} from './properties.reducer'

// Lookup the 'Properties' feature state managed by NgRx
export const selectPropertiesFeature = createFeatureSelector<
  PartialPropertiesState,
  State
>(PROPERTIES_FEATURE_KEY)

export const selectLots = createSelector(
  selectPropertiesFeature,
  (state) => state.lots
)

export const selectProperties = createSelector(selectLots, (lots) =>
  lots.reduce(
    (properties, lot) =>
      lot.property ? properties.concat([lot.property]) : properties,
    []
  )
)

export const selectPropertyByAddress = (address: LotAddress) =>
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
