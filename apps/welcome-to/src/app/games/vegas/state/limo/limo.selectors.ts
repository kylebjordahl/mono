import { createFeatureSelector, createSelector } from "@ngrx/store";
import { LimoState, LIMO_FEATURE_KEY, PartialLimoState } from "./limo.reducer";

// Lookup the 'Properties' feature state managed by NgRx
export const selectLimoFeature = createFeatureSelector<
  PartialLimoState,
  LimoState
>(LIMO_FEATURE_KEY)

export const selectLimoLocation = createSelector(
  selectLimoFeature,
  (state)=>state.currentIntersectionAddress
)
