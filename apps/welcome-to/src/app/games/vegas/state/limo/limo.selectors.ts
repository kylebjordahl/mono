import { createFeatureSelector, createSelector } from '@ngrx/store'
import { LimoState, LIMO_FEATURE_KEY, PartialLimoState } from './limo.reducer'
import * as R from 'ramda'
import { RoadSegment } from '../properties/properties.models'

// Lookup the 'Properties' feature state managed by NgRx
export const selectLimoFeature = createFeatureSelector<
  PartialLimoState,
  LimoState
>(LIMO_FEATURE_KEY)

export const selectLimoLocation = createSelector(
  selectLimoFeature,
  (state) => state.currentIntersection.address
)

export const selectIsDriving = createSelector(
  selectLimoFeature,
  (state) => state.currentDrive !== null
)

export const selectNextRoads = createSelector(selectLimoFeature, (state) => {
  if (state.currentDrive === null) {
    return []
  } else {
    const used = R.unionWith(
      R.eqProps('id'),
      state.visitedRoadSegments,
      state.currentDrive
    )
    const unused = R.differenceWith(
      R.eqProps('id'),
      state.currentIntersection.connectedRoads,
      used
    ) as RoadSegment[]

    const withIntersectionsAvailable = unused.filter((r) =>
      r.intersections.some((id) => id !== state.currentIntersection.id)
    )

    return withIntersectionsAvailable
  }
})

export const selectVisitedRoads = createSelector(selectLimoFeature, (state) => {
  return state.visitedRoadSegments
})

export const selectCurrentDrive = createSelector(selectLimoFeature, (state) => {
  return state.currentDrive
})
