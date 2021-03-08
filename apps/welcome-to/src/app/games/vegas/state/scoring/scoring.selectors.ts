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
        (value, idx, arr) => ({
          value,
          isMarked: idx < improvementCount,
          isImprovable: idx < arr.length - 1,
        })
      )
      return mapped
    }, improvements)
)

export const selectInaugurationTrackCount = createSelector(
  selectScoringFeature,
  ({ inaugurationTrack }) => inaugurationTrack
)

export const selectAvailableBonuses = createSelector(
  selectScoringFeature,
  ({ inaugurationBonusesUsed, inaugurationTrack }) =>
    ScoringData.inaugurationTrackBonusesAvailable(inaugurationTrack) -
    inaugurationBonusesUsed.length
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

export const selectInaugurationTrack = createSelector(
  selectScoringFeature,
  ({
    inaugurationTrack,
    inaugurationBonusesUsed,
    isOfferingInaugurationBonusType,
  }) => {
    let remainingChecks = inaugurationTrack
    let isOfferingTracker = isOfferingInaugurationBonusType
    return ScoringData.inaugurationTrackGroupings.map((count, idx) => {
      const checkboxes = Array(count)
        .fill(false)
        .map(() => {
          remainingChecks -= 1
          return remainingChecks >= 0
        })
      const bonusAvailable = checkboxes.every((c) => c)
      const bonusUsed = inaugurationBonusesUsed[idx] ?? null
      let isOffering = false
      if (isOfferingTracker && bonusAvailable && !bonusUsed) {
        isOfferingTracker = false
        isOffering = true
      }

      return {
        checkboxes,
        bonusAvailable,
        bonusUsed,
        isOffering,
      }
    })
  }
)

export const selectCashAccounts = createSelector(
  selectScoringFeature,
  (state) => ({
    credits: state.credits,
    debts: state.debts,
  })
)
