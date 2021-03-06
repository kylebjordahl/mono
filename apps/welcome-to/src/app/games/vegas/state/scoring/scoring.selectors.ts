import { createFeatureSelector, createSelector } from '@ngrx/store'
import * as R from 'ramda'
import { ScoringData } from './scoring.model'
import {
  PartialScoringState,
  ScoreState,
  SCORING_FEATURE_KEY,
} from './scoring.reducer'

// Lookup the 'Properties' feature state managed by NgRx
export const selectScoringFeature = createFeatureSelector<
  PartialScoringState,
  ScoreState
>(SCORING_FEATURE_KEY)

export const selectImprovements = createSelector(
  selectScoringFeature,
  ({ improvements }) =>
    R.mapObjIndexed((improvementCount, area) => {
      const mapped = (ScoringData.improvements[area] as unknown[]).map(
        (value, idx) => ({
          value,
          marked: idx < improvementCount,
        })
      )
      return mapped
    }, improvements)
)

export const selectInaugurationTrackCount = createSelector(
  selectScoringFeature,
  ({ inaugurationTrack }) => inaugurationTrack
)

export const selectAvailableScoringBonuses = createSelector(
  selectScoringFeature,
  ({ inaugurationBonusesUsed, inaugurationTrack }) =>
    ScoringData.inaugurationTrackBonusesAvailable(inaugurationTrack) -
    inaugurationBonusesUsed
)

export const selectShowTracks = createSelector(
  selectScoringFeature,
  ({ shows }) =>
    R.mapObjIndexed((improvementCount, area) => {
      const mapped = (ScoringData.show[area] as unknown[]).map(
        (value, idx) => ({
          value,
          marked: idx < improvementCount,
          cash: ScoringData.show[`${area}Cash`].includes(idx + 1),
        })
      )
      return { shows: mapped, isStarted: mapped.some((m) => m.marked) }
    }, shows)
)
