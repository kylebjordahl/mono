import { createReducer, on, State } from '@ngrx/store'
import * as GameAction from '../game/game.actions'
import * as PropertyAction from '../properties/properties.actions'
import { ImprovementArea, ScoringData } from './scoring.model'
import * as ScoringAction from '../scoring/scoring.actions'
import * as R from 'ramda'

export interface ScoreState {
  /** money owed */
  debts: number
  /** money collected */
  credits: number

  /** max is 14 */
  inaugurationTrack: number
  inaugurationBonusesUsed: number

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
  /** max is 6 */
  showTrackLeft: number
  /** max is 6 */
  showTrackRight: number

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
  inaugurationTrack: 0,
  inaugurationBonusesUsed: 0,
  inaugurationRank: null,
  wasLastInauguration: null,
  showTrackLeft: 0,
  showTrackRight: 0,
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
  on(ScoringAction.doInaugurationEvent, (state) => ({
    ...state,
    inaugurationTrack: Math.min(14, state.inaugurationTrack + 1),
  })),
  on(ScoringAction.useInaugurationBonus, (state) => ({
    ...state,
    inaugurationBonusesUsed: state.inaugurationBonusesUsed + 1,
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
    )
  })
)
