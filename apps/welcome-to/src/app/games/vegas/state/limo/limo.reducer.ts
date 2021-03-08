import { createReducer, on } from '@ngrx/store'
import { intersections } from '../properties/initialProperties'
import {
  Intersection,
  RoadSegment,
  StreetAvenueAddress,
} from '../properties/properties.models'
import { cancelDrive, driveRoad, startDrivingLimo } from './limo.actions'
import * as R from 'ramda'
import { reset } from '../game/game.actions'

export interface LimoState {
  currentIntersection: Intersection
  visitedRoadSegments: RoadSegment[]
  /** array represents a drive in progress, null means not driving*/
  currentDrive: RoadSegment[] | null
}

export const LIMO_FEATURE_KEY = 'LIMO'

export interface PartialLimoState {
  [LIMO_FEATURE_KEY]: LimoState
}

export const initialState: LimoState = {
  currentIntersection: intersections.find((i) =>
    R.equals(i.address, {
      street: 2,
      avenue: 2,
    })
  ),
  visitedRoadSegments: [],
  currentDrive: null,
}

export const limoReducer = createReducer(
  initialState,
  on(reset, () => initialState),
  on(startDrivingLimo, (state) => {
    return {
      ...state,
      currentDrive: [] as RoadSegment[],
    }
  }),
  on(cancelDrive, (state) => {
    // find the intersection shared by the start of the drive and the last road visted
    const currentIntersection = state.currentDrive.length
      ? intersections.find(
          (i) =>
            R.head(state.currentDrive).intersections.includes(i.id) &&
            R.last(state.visitedRoadSegments).intersections.includes(i.id)
        )
      : state.currentIntersection
    return {
      ...state,
      currentDrive: null,
      currentIntersection,
    }
  }),

  on(driveRoad, (state, { road }) => {
    // only add the road if we have a connection to it and we're driving
    if (
      !!state.currentIntersection.connectedRoads.find(
        (r) => r.id === road.id
      ) &&
      state.currentDrive !== null
    ) {
      const nextIntersectionId = road.intersections.find(
        (id) => id !== state.currentIntersection.id
      )
      const nextIntersection = intersections.find(
        (i) => i.id === nextIntersectionId
      )

      if (nextIntersection.hasTaxiStand) {
        // drive is over!
        return {
          ...state,
          // end the drive if we reach a taxiStand
          currentDrive: null,
          visitedRoadSegments: state.visitedRoadSegments.concat([
            ...state.currentDrive,
            road,
          ]),
          currentIntersection: nextIntersection,
        }
      } else {
        // drive is over!
        return {
          ...state,
          // end the drive if we reach a taxiStand
          currentDrive: state.currentDrive.concat([road]),
          currentIntersection: nextIntersection,
        }
      }
    } else {
      return state
    }
  })
)
