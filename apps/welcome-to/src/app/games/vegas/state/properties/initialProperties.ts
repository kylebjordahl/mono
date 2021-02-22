import { Lot, RedCarpet, Property } from './properties.models'

/** initial state of all properties at game start */
const initialState = {
  casinoNumber: null,
  hasGolf: null,
  hasShow: false,
  isLimoPassing: false,
} as Partial<Property>

const street1 = [
  { address: { street: 1, avenue: 1 } },
  {
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
    address: { street: 1, avenue: 10 },
    property: {
      isConstructed: false,
      golfDefinition: 5,
      redCarpet: null,
      canHaveShow: false,
      ...initialState,
    },
  },
  { address: { street: 1, avenue: 11 } },
] as Lot[]

const street2 = [
  {
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
  { address: { street: 3, avenue: 1 } },
  { address: { street: 3, avenue: 2 } },

  {
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
    address: { street: 4, avenue: 9 },
    property: {
      isConstructed: true,
      golfDefinition: null,
      redCarpet: RedCarpet.Mob,
      canHaveShow: false,
      ...initialState,
    },
  },
  { address: { street: 4, avenue: 10 } },
  { address: { street: 4, avenue: 11 } },
] as Lot[]

export const initialLots = [...street1, ...street2, ...street3, ...street4]
