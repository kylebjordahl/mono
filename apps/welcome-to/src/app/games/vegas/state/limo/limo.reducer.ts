import { createReducer } from "@ngrx/store"
import { Intersection, RoadSegment, StreetAvenueAddress } from "../properties/properties.models"

export interface LimoState {
  currentIntersectionAddress: StreetAvenueAddress,
  visitedRoadSegments: RoadSegment[]
}

export const LIMO_FEATURE_KEY = 'LIMO'

export interface PartialLimoState {
  [LIMO_FEATURE_KEY]: LimoState
}

export const initialState: LimoState = {
  currentIntersectionAddress: {
    street:2,
    avenue:2
  },
  visitedRoadSegments:[]
}

export const limoReducer = createReducer(
  initialState,
)
