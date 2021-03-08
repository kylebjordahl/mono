import { createAction, props } from '@ngrx/store'
import { ImprovementArea, InaugurationBonusType } from './scoring.model'

export const makeImprovements = createAction(
  '[Scoring] Make Improvements',
  props<{ area: ImprovementArea }>()
)

export const doInaugurationEvent = createAction('[Scoring] Inauguration Event')

export const offerInaugurationBonusTypes = createAction(
  '[Scoring] Offer Inauguration Bonus Types'
)

export const cancelOfferBonusTypes = createAction(
  '[Scoring] Cancel Offer Inauguration Bonus Types'
)

export const useInaugurationBonus = createAction(
  '[Scoring] Use Inauguration Bonus',
  props<{ bonus: InaugurationBonusType }>()
)

export const addDebt = createAction('[Scoring] Add Debt')
export const addCredit = createAction('[Scoring] Add Credit')
