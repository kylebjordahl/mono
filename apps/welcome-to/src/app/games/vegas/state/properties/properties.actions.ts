import { createAction, props } from '@ngrx/store'

import { StreetAvenueAddress, Property, HotelSize } from './properties.models'

export const constructProperty = createAction(
  '[Properties] Construct property',
  props<{ address: StreetAvenueAddress }>()
)

export const openCasino = createAction(
  '[Property] Open Casino',
  props<{ address: StreetAvenueAddress; casinoNumber: number }>()
)

export const resetCasino = createAction(
  '[Property] Reset Casino',
  props<{ address: StreetAvenueAddress }>()
)

export const openShow = createAction(
  '[Property] Open Show',
  props<{ address: StreetAvenueAddress, showTrack: 'LEFT' | 'RIGHT' }>()
)

export const updateProperty = createAction(
  '[Property] Update Property',
  props<{ address: StreetAvenueAddress; property: Partial<Property> }>()
)

export const openHotel = createAction(
  '[Property] Open Hotel',
  props<{avenue: number}>()
)

export const changeHotelAvailability = createAction(
  '[Property] Change Hotel Availability',
  props<{avenue: number, available: HotelSize}>()
)
