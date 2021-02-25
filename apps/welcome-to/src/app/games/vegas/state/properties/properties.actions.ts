import { createAction, props } from '@ngrx/store'

import { LotAddress, Property } from './properties.models'

export const constructProperty = createAction(
  '[Properties] Construct property',
  props<{ address: LotAddress }>()
)

export const openCasino = createAction(
  '[Property] Open Casino',
  props<{ address: LotAddress; casinoNumber: number }>()
)

export const resetCasino = createAction(
  '[Property] Reset Casino',
  props<{ address: LotAddress }>()
)

export const openShow = createAction(
  '[Property] Open Show',
  props<{ address: LotAddress }>()
)

export const updateProperty = createAction(
  '[Property] Update Property',
  props<{ address: LotAddress; property: Partial<Property> }>()
)
