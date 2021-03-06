import { createAction, props } from '@ngrx/store'
import { ImprovementArea } from './scoring.model'

export const makeImprovements = createAction(
  '[Scoring] Make Improvements',
  props<{ area: ImprovementArea }>()
)

export const doInaugurationEvent = createAction('[Scoring] Inauguration Event')
// PROPS TBD
export const useInaugurationBonus = createAction(
  '[Scoring] Use Inauguration Bonus'
  // props<unknown>()
)

export const addDebt = createAction('[Scoring] Add Debt')
export const addCredit = createAction('[Scoring] Add Credit')
