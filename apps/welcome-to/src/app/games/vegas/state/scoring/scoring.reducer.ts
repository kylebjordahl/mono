import { createReducer, on, State } from '@ngrx/store'
import * as GameAction from '../game/game.actions'
import * as PropertyAction from '../properties/properties.actions'
import {
  ImprovementArea,
  InaugurationBonusType,
  ScoringData,
} from './scoring.model'
import * as ScoringAction from '../scoring/scoring.actions'
import * as R from 'ramda'

export interface ScoreState {
  /** money owed */
  debts: number
  /** money collected */
  credits: number

  /** max is 14 */
  inaugurationTrack: number
  inaugurationBonusesUsed: InaugurationBonusType[]
  isOfferingInaugurationBonusType: boolean

  inaugurationRank: number
  wasLastInauguration: boolean

  improvements: {
    [ImprovementArea.Inauguration]: number
    /** max is 4 */
    [ImprovementArea.FullHotel]: number
    /** max is 4 */
    [ImprovementArea.PartialHotel]: number
    /** max is 3 */
    [ImprovementArea.StreetScoring]: number

    /** max is 3 */
    [ImprovementArea.Par3]: number
    /** max is 3 */
    [ImprovementArea.Par4]: number
    /** max is 3 */
    [ImprovementArea.Par5]: number

    /** max is 3 */
    [ImprovementArea.Vip]: number
    /** max is 3 */
    [ImprovementArea.Fountain]: number
    /** max is 3 */
    [ImprovementArea.LimoPenalty]: number
  }
  shows: {
    /** max is 6 */
    left: number
    /** max is 6 */
    right: number
  }

  projects: {
    pink: number
    purple: number
    yellow: number
  }
}

export const SCORING_FEATURE_KEY = 'SCORING'
export interface PartialScoringState {
  [SCORING_FEATURE_KEY]: ScoreState
}

export const initialState: ScoreState = {
  debts: 0,
  credits: 1,
  inaugurationTrack: 3,
  inaugurationBonusesUsed: [],
  isOfferingInaugurationBonusType: false,
  inaugurationRank: null,
  wasLastInauguration: null,
  shows: {
    left: 0,
    right: 0,
  },
  improvements: {
    [ImprovementArea.Inauguration]: 0,
    [ImprovementArea.FullHotel]: 0,
    [ImprovementArea.PartialHotel]: 0,
    [ImprovementArea.StreetScoring]: 0,
    [ImprovementArea.Par3]: 0,
    [ImprovementArea.Par4]: 0,
    [ImprovementArea.Par5]: 0,
    [ImprovementArea.Vip]: 0,
    [ImprovementArea.Fountain]: 0,
    [ImprovementArea.LimoPenalty]: 0,
  },
  projects: {
    pink: 0,
    purple: 0,
    yellow: 0,
  },
}

export const scoringReducer = createReducer(
  initialState,
  on(GameAction.reset, () => initialState),
  on(PropertyAction.constructProperty, (state) => ({
    ...state,
    debts: state.debts + 1,
  })),
  on(ScoringAction.addDebt, (state) => ({
    ...state,
    debts: state.debts + 1,
  })),
  on(ScoringAction.addCredit, (state) => ({
    ...state,
    credits: state.credits + 1,
  })),
  on(ScoringAction.doInaugurationEvent, (state) => ({
    ...state,
    inaugurationTrack: Math.min(14, state.inaugurationTrack + 1),
  })),
  on(ScoringAction.offerInaugurationBonusTypes, (state) => {
    return {
      ...state,
      isOfferingInaugurationBonusType: true,
    }
  }),
  on(ScoringAction.cancelOfferBonusTypes, (state) => {
    return {
      ...state,
      isOfferingInaugurationBonusType: false,
    }
  }),
  on(ScoringAction.useInaugurationBonus, (state, { bonus }) => ({
    ...state,
    inaugurationBonusesUsed: state.inaugurationBonusesUsed.concat([bonus]),
    isOfferingInaugurationBonusType: false,
  })),
  on(ScoringAction.makeImprovements, (state, { area }) => {
    const lens = R.lensPath(['improvements', area])

    return R.over(
      lens,
      (current) =>
        Math.min(
          Number(current ?? 0) + 1,
          ScoringData.improvements[area].length - 1
        ),
      state
    ) as ScoreState
  }),
  on(PropertyAction.openShow, (state, action) => {
    const track = action.showTrack.toLocaleLowerCase()
    const lens = R.lensPath(['shows', track])
    const newState = R.over(
      lens,
      (current: number) => current + 1,
      state
    ) as ScoreState

    // process debts
    const currentShowCount = R.view(lens, newState) as number
    if (currentShowCount === 1) {
      // always add two debts for first show on track,
      newState.debts += 2
    } else {
      if (
        track === 'left' &&
        (currentShowCount == 5 || currentShowCount == 6)
      ) {
        newState.credits += 1
      } else if (
        track === 'right' &&
        (currentShowCount == 3 || currentShowCount == 4)
      ) {
        newState.credits += 1
      }
    }

    return newState
  })
)
