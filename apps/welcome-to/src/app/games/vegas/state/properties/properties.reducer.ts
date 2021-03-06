import * as PropertyActions from './properties.actions'
import { Property, StreetAvenueAddress, Lot, RoadSegment, Intersection, Hotel, HotelSize } from './properties.models'
import { allRoads, initialLots, intersections } from './initialProperties'
import { createReducer, on } from '@ngrx/store'
import * as R from 'ramda'
import * as GameActions from '../game/game.actions'

export interface State {
  lots: Lot[]
  hotels: Hotel[]
}

export const PROPERTIES_FEATURE_KEY = 'PROPERTIES'

export interface PartialPropertiesState {
  [PROPERTIES_FEATURE_KEY]: State
}

export const initialState: State = {
  lots: initialLots,
  hotels: Array(11).fill({available: HotelSize.Full, opened: null}).map((h,idx)=>({...h, avenue:idx+1}))
}

export const propertiesReducer = createReducer(
  initialState,
  on(GameActions.reset, () => initialState),
  on(PropertyActions.openShow, (state, { address }) => ({
    ...state,
    lots: changeByAddress(state.lots, address, 'hasShow', () => true, [
      hasProperty,
      isConstructed,
      isOpened,
      canHaveShow,
    ]),
  })),
  on(PropertyActions.constructProperty, (state, { address }) => {
    return {
    ...state,
      lots: changeByAddress(state.lots, address, 'isConstructed', () => true, [
        hasProperty,
        R.compose(R.not, isConstructed),
      ]),
    }
  }),
  on(PropertyActions.changeHotelAvailability, (state, {available, avenue})=>({
    ...state,
    hotels: R.over(
      R.lensPath([
        R.findIndex(R.propEq('avenue', avenue), state.hotels),
        'available'
      ]),
      ()=>available,
      state.hotels
    ) as Hotel[]
  })),
  on(PropertyActions.openHotel, (state, { avenue})=>({
    ...state,
    hotels: R.over(
      R.lensPath([
        R.findIndex(R.propEq('avenue', avenue), state.hotels),

      ]),
      (hotel: Hotel):Hotel=>({
        ...hotel,
        available: HotelSize.Partial,
        opened: hotel.available,
      }),
      state.hotels
    ) as Hotel[]
  })),
  on(PropertyActions.updateProperty, (state, { address, property }) => ({
    ...state,

    lots: R.over(
      R.lensPath([
        R.findIndex(R.propEq('address', address), state.lots),
        'property',
      ]),
      (existing: Record<string, unknown> | undefined)=>existing ? R.mergeDeepLeft(property, existing) : undefined,
      state.lots
    ) as Lot[],
  }))
  // on(PropertyActions.openCasino, (state, { address, casinoNumber }) => ({
  //   lots: changeByAddress(
  //     state.lots,
  //     address,
  //     'casinoNumber',
  //     () => {
  //       // casino number constraints
  //       if (casinoNumber > 17 || casinoNumber < 0) {
  //         return null
  //       }
  //       const leftOfAddress = state.lots.filter(
  //         (l) =>
  //           l.address.street === address.street &&
  //           l.address.avenue < address.avenue &&
  //           l.property?.isConstructed
  //       )
  //       const rightOfAddress = state.lots.filter(
  //         (l) =>
  //           l.address.street === address.street &&
  //           l.address.avenue > address.avenue &&
  //           l.property?.isConstructed
  //       )

  //       if (
  //         !leftOfAddress.every(
  //           (l) =>
  //             !l.property?.casinoNumber ||
  //             l.property?.casinoNumber < casinoNumber
  //         )
  //       ) {
  //         return null
  //       }
  //       if (
  //         !rightOfAddress.every(
  //           (l) =>
  //             !l.property?.casinoNumber ||
  //             l.property?.casinoNumber > casinoNumber
  //         )
  //       ) {
  //         return null
  //       }

  //       return casinoNumber
  //     },
  //     [hasNoCasinoNumber, hasProperty]
  //   ),
  // }))
  // on(PropertyActions.openShow, (state, {address})=>({
  //   lots: changeByAddress(state.lots,address,'hasShow')
  // }))
)

function changeByAddress<T extends keyof Property>(
  lots: Lot[],
  address: StreetAvenueAddress,
  key: T,
  updateFn: (x: Property[T]) => Property[T],
  checks?: ((x: Lot, lots: Lot[]) => boolean)[]
): Lot[] {
  const addressIndex = R.findIndex(R.propEq('address', address), lots)
  const passChecks = checks.every((c) => c(lots[addressIndex], lots))
  if (!passChecks) {
    throw Error('Reducer failed checks')
  }
  const lens = (idx) => R.lensPath([idx, 'property', key])
  const updated = R.over(lens(addressIndex), updateFn, lots)
  return updated as Lot[]
}

const hasProperty = R.has('property')
const isConstructed = R.pathOr(false, ['property', 'isConstructed'])
const hasNoCasinoNumber = R.compose(R.not, R.has('casinoNumber'))
const isOpened = R.pathOr(false, ['property', 'casinoNumber'])
const canHaveShow = R.pathOr(false, ['property', 'canHaveShow'])
