import * as R from 'ramda'
import {
  Lot,
  RedCarpet,
  Property,
  Intersection,
  RoadSegment,
} from './properties.models'

/** initial state of all properties at game start */
const initialState = {
  casinoNumber: null,
  hasGolf: null,
  hasShow: false,
  isLimoPassing: false,
} as Partial<Property>

const street1 = [
  {
    roads: {
      street: undefined,
      avenue: undefined,
    },
    address: { street: 1, avenue: 1 },
  },
  {
    roads: {
      street: undefined,
      avenue: undefined,
    },
    address: { street: 1, avenue: 2 },
    property: {
      isConstructed: false,
      golfDefinition: 5,
      redCarpet: null,
      canHaveShow: false,
      ...initialState,
    },
  },
  {
    roads: {
      street: undefined,
      avenue: undefined,
    },
    address: { street: 1, avenue: 3 },
    property: {
      isConstructed: true,
      golfDefinition: 4,
      redCarpet: RedCarpet.Mob,
      canHaveShow: false,
      ...initialState,
    },
  },
  {
    roads: {
      street: undefined,
      avenue: undefined,
    },
    address: { street: 1, avenue: 4 },
    property: {
      isConstructed: true,
      golfDefinition: 4,
      redCarpet: RedCarpet.Fountain,
      canHaveShow: true,
      ...initialState,
    },
  },
  {
    roads: {
      street: undefined,
      avenue: undefined,
    },
    address: { street: 1, avenue: 5 },
    property: {
      isConstructed: true,
      golfDefinition: 3,
      redCarpet: null,
      canHaveShow: false,
      ...initialState,
    },
  },
  {
    roads: {
      street: undefined,
      avenue: undefined,
    },
    address: { street: 1, avenue: 6 },
    property: {
      isConstructed: true,
      golfDefinition: 3,
      redCarpet: null,
      canHaveShow: false,
      ...initialState,
    },
  },
  {
    roads: {
      street: undefined,
      avenue: undefined,
    },
    address: { street: 1, avenue: 7 },
    property: {
      isConstructed: true,
      golfDefinition: 3,
      redCarpet: RedCarpet.Fountain,
      canHaveShow: true,
      ...initialState,
    },
  },
  {
    roads: {
      street: undefined,
      avenue: undefined,
    },
    address: { street: 1, avenue: 8 },
    property: {
      isConstructed: true,
      golfDefinition: 4,
      redCarpet: null,
      canHaveShow: false,
      ...initialState,
    },
  },
  {
    roads: {
      street: undefined,
      avenue: undefined,
    },
    address: { street: 1, avenue: 9 },
    property: {
      isConstructed: true,
      golfDefinition: 4,
      redCarpet: null,
      canHaveShow: true,
      ...initialState,
    },
  },
  {
    roads: {
      street: undefined,
      avenue: undefined,
    },
    address: { street: 1, avenue: 10 },
    property: {
      isConstructed: false,
      golfDefinition: 5,
      redCarpet: null,
      canHaveShow: false,
      ...initialState,
    },
  },
  {
    roads: {
      street: undefined,
      avenue: undefined,
    },
    address: { street: 1, avenue: 11 },
  },
] as Lot[]

const street2 = [
  {
    roads: {
      street: undefined,
      avenue: undefined,
    },
    address: { street: 2, avenue: 1 },
    property: {
      isConstructed: false,
      golfDefinition: null,
      redCarpet: null,
      canHaveShow: false,
      ...initialState,
    },
  },
  {
    roads: {
      street: undefined,
      avenue: undefined,
    },
    address: { street: 2, avenue: 2 },
    property: {
      isConstructed: true,
      golfDefinition: null,
      redCarpet: RedCarpet.Fountain,
      canHaveShow: false,
      ...initialState,
    },
  },
  {
    roads: {
      street: undefined,
      avenue: undefined,
    },
    address: { street: 2, avenue: 3 },
    property: {
      isConstructed: true,
      golfDefinition: null,
      redCarpet: null,
      canHaveShow: false,
      ...initialState,
    },
  },
  {
    roads: {
      street: undefined,
      avenue: undefined,
    },
    address: { street: 2, avenue: 4 },
    property: {
      isConstructed: false,
      golfDefinition: null,
      redCarpet: null,
      canHaveShow: true,
      ...initialState,
    },
  },
  {
    roads: {
      street: undefined,
      avenue: undefined,
    },
    address: { street: 2, avenue: 5 },
    property: {
      isConstructed: true,
      golfDefinition: null,
      redCarpet: RedCarpet.VIP,
      canHaveShow: false,
      ...initialState,
    },
  },
  {
    roads: {
      street: undefined,
      avenue: undefined,
    },
    address: { street: 2, avenue: 6 },
    property: {
      isConstructed: true,
      golfDefinition: null,
      redCarpet: null,
      canHaveShow: false,
      ...initialState,
    },
  },
  {
    roads: {
      street: undefined,
      avenue: undefined,
    },
    address: { street: 2, avenue: 7 },
    property: {
      isConstructed: true,
      golfDefinition: null,
      redCarpet: null,
      canHaveShow: true,
      ...initialState,
    },
  },
  {
    roads: {
      street: undefined,
      avenue: undefined,
    },
    address: { street: 2, avenue: 8 },
    property: {
      isConstructed: true,
      golfDefinition: null,
      redCarpet: null,
      canHaveShow: false,
      ...initialState,
    },
  },
  {
    roads: {
      street: undefined,
      avenue: undefined,
    },
    address: { street: 2, avenue: 9 },
    property: {
      isConstructed: false,
      golfDefinition: null,
      redCarpet: RedCarpet.VIP,
      canHaveShow: false,
      ...initialState,
    },
  },
  {
    roads: {
      street: undefined,
      avenue: undefined,
    },
    address: { street: 2, avenue: 10 },
    property: {
      isConstructed: true,
      golfDefinition: null,
      redCarpet: null,
      canHaveShow: true,
      ...initialState,
    },
  },
  {
    roads: {
      street: undefined,
      avenue: undefined,
    },
    address: { street: 2, avenue: 11 },
    property: {
      isConstructed: true,
      golfDefinition: null,
      redCarpet: RedCarpet.Mob,
      canHaveShow: false,
      ...initialState,
    },
  },
] as Lot[]

const street3 = [
  {
    roads: {
      street: undefined,
      avenue: undefined,
    },
    address: { street: 3, avenue: 1 },
  },
  {
    roads: {
      street: undefined,
      avenue: undefined,
    },
    address: { street: 3, avenue: 2 },
  },

  {
    roads: {
      street: undefined,
      avenue: undefined,
    },
    address: { street: 3, avenue: 3 },
    property: {
      isConstructed: true,
      golfDefinition: null,
      redCarpet: null,
      canHaveShow: true,
      ...initialState,
    },
  },
  {
    roads: {
      street: undefined,
      avenue: undefined,
    },
    address: { street: 3, avenue: 4 },
    property: {
      isConstructed: true,
      golfDefinition: null,
      redCarpet: null,
      canHaveShow: false,
      ...initialState,
    },
  },
  {
    roads: {
      street: undefined,
      avenue: undefined,
    },
    address: { street: 3, avenue: 5 },
    property: {
      isConstructed: false,
      golfDefinition: null,
      redCarpet: null,
      canHaveShow: true,
      ...initialState,
    },
  },
  {
    roads: {
      street: undefined,
      avenue: undefined,
    },
    address: { street: 3, avenue: 6 },
    property: {
      isConstructed: true,
      golfDefinition: null,
      redCarpet: RedCarpet.VIP,
      canHaveShow: false,
      ...initialState,
    },
  },
  {
    roads: {
      street: undefined,
      avenue: undefined,
    },
    address: { street: 3, avenue: 7 },
    property: {
      isConstructed: true,
      golfDefinition: null,
      redCarpet: null,
      canHaveShow: false,
      ...initialState,
    },
  },
  {
    roads: {
      street: undefined,
      avenue: undefined,
    },
    address: { street: 3, avenue: 8 },
    property: {
      isConstructed: true,
      golfDefinition: null,
      redCarpet: null,
      canHaveShow: true,
      ...initialState,
    },
  },
  {
    roads: {
      street: undefined,
      avenue: undefined,
    },
    address: { street: 3, avenue: 9 },
    property: {
      isConstructed: true,
      golfDefinition: null,
      redCarpet: RedCarpet.Fountain,
      canHaveShow: true,
      ...initialState,
    },
  },
  {
    roads: {
      street: undefined,
      avenue: undefined,
    },
    address: { street: 3, avenue: 10 },
    property: {
      isConstructed: true,
      golfDefinition: null,
      redCarpet: null,
      canHaveShow: false,
      ...initialState,
    },
  },
  {
    roads: {
      street: undefined,
      avenue: undefined,
    },
    address: { street: 3, avenue: 11 },
    property: {
      isConstructed: false,
      golfDefinition: null,
      redCarpet: null,
      canHaveShow: false,
      ...initialState,
    },
  },
] as Lot[]

const street4 = [
  {
    roads: {
      street: undefined,
      avenue: undefined,
    },
    address: { street: 4, avenue: 1 },
    property: {
      isConstructed: true,
      golfDefinition: null,
      redCarpet: null,
      canHaveShow: true,
      ...initialState,
    },
  },
  {
    roads: {
      street: undefined,
      avenue: undefined,
    },
    address: { street: 4, avenue: 2 },
    property: {
      isConstructed: true,
      golfDefinition: null,
      redCarpet: RedCarpet.Mob,
      canHaveShow: false,
      ...initialState,
    },
  },
  {
    roads: {
      street: undefined,
      avenue: undefined,
    },
    address: { street: 4, avenue: 3 },
    property: {
      isConstructed: false,
      golfDefinition: null,
      redCarpet: RedCarpet.VIP,
      canHaveShow: false,
      ...initialState,
    },
  },
  {
    roads: {
      street: undefined,
      avenue: undefined,
    },
    address: { street: 4, avenue: 4 },
    property: {
      isConstructed: true,
      golfDefinition: null,
      redCarpet: null,
      canHaveShow: false,
      ...initialState,
    },
  },
  {
    roads: {
      street: undefined,
      avenue: undefined,
    },
    address: { street: 4, avenue: 5 },
    property: {
      isConstructed: true,
      golfDefinition: null,
      redCarpet: RedCarpet.Fountain,
      canHaveShow: false,
      ...initialState,
    },
  },
  {
    roads: {
      street: undefined,
      avenue: undefined,
    },
    address: { street: 4, avenue: 6 },
    property: {
      isConstructed: true,
      golfDefinition: null,
      redCarpet: null,
      canHaveShow: false,
      ...initialState,
    },
  },
  {
    roads: {
      street: undefined,
      avenue: undefined,
    },
    address: { street: 4, avenue: 7 },
    property: {
      isConstructed: true,
      golfDefinition: null,
      redCarpet: RedCarpet.VIP,
      canHaveShow: true,
      ...initialState,
    },
  },
  {
    roads: {
      street: undefined,
      avenue: undefined,
    },
    address: { street: 4, avenue: 8 },
    property: {
      isConstructed: false,
      golfDefinition: null,
      redCarpet: null,
      canHaveShow: false,
      ...initialState,
    },
  },
  {
    roads: {
      street: undefined,
      avenue: undefined,
    },
    address: { street: 4, avenue: 9 },
    property: {
      isConstructed: true,
      golfDefinition: null,
      redCarpet: RedCarpet.Mob,
      canHaveShow: false,
      ...initialState,
    },
  },
  {
    roads: {
      street: undefined,
      avenue: undefined,
    },
    address: { street: 4, avenue: 10 },
  },
  {
    roads: {
      street: undefined,
      avenue: undefined,
    },
    address: { street: 4, avenue: 11 },
  },
] as Lot[]

export const initialLots = [...street1, ...street2, ...street3, ...street4]

const roads: { street: RoadSegment[][]; avenue: RoadSegment[][] } = {
  street: Array(4)
    .fill(Array(11).fill({ orientation: 'STREET', intersections: [] }))
    .map((arr, s) =>
      arr.map((x, a) => ({
        ...x,
        address: { street: s + 1, avenue: a + 1 },
        id: `STREET:${s + 1},${a + 1}`,
      }))
    ),
  avenue: Array(11)
    .fill(Array(4).fill({ orientation: 'AVENUE', intersections: [] }))
    .map((arr, a) =>
      arr.map((x, s) => ({
        ...x,
        address: { street: s + 1, avenue: a + 1 },
        id: `AVENUE:${s + 1},${a + 1}`,
      }))
    ),
}
// take out the two missing roads
roads.avenue[10][0] = undefined
roads.avenue[10][3] = undefined
roads.avenue[0][2] = undefined

export const allRoads = [...roads.street, ...roads.avenue]
  .flat()
  .filter((x) => x)

const safeArrayGet = <T>(arr: T[], idx: number): T | undefined => {
  try {
    return arr[idx]
  } catch {
    return undefined
  }
}

// assemble the array of intersections, enriching the roads as we go
export const intersections: Intersection[] = Array(44)
  .fill(null)
  .map((_, idx) => {
    const avenue = (idx % 11) + 1
    const street = Math.floor(idx / 11) + 1
    const intersection = {
      id: idx,
      address: { street, avenue },
      connectedRoads: [
        // minus 1 because the data structure is 0 based
        roads.street[street - 1][avenue - 1],
        safeArrayGet(roads.street[street - 1], avenue),
        safeArrayGet(roads.avenue[avenue - 1], street - 1),
        safeArrayGet(roads.avenue[avenue - 1], street),
      ].filter((x) => x),
      hasTaxiStand: idx % 2 === 0,
    }
    intersection.connectedRoads.forEach(
      (r) => (r.intersections = R.uniq([...r.intersections, intersection.id]))
    )

    return intersection
  })

// put roads on the lots
// initialLots.forEach((lot) => {
//   lot.roads.street =
//     roads.street[lot.address.street - 1][lot.address.avenue - 1]
//   lot.roads.avenue = safeArrayGet(
//     roads.avenue[lot.address.avenue - 1],
//     lot.address.street - 1
//   )
// })
