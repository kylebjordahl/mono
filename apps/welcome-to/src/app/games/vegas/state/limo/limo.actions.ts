import { createAction, props } from '@ngrx/store'
import { RoadSegment } from '../properties/properties.models'

export const startDrivingLimo = createAction('[Limo] Start Driving')
export const cancelDrive = createAction('[Limo] Cancel Driving')

export const driveRoad = createAction(
  '[Limo] Drive Road',
  props<{
    road: RoadSegment
  }>()
)
