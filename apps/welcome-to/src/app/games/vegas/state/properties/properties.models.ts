export interface Property {
  /** whether the casino has been constructed */
  isConstructed: boolean
  /** the casino number assigned in game, `null` if not yet assigned */
  casinoNumber?: number

  canHaveShow: boolean
  hasShow: boolean

  redCarpet: RedCarpet | null
  isLimoPassing: boolean

  /** null if no golf, otherwise par number */
  golfDefinition: number | null
  /** `null` if property is not yet opened, `true` if golf is linked, `false` if not linked after open */
  hasGolf: null | boolean
}

export interface Lot {
  address: StreetAvenueAddress
  property?: Property
  roads: {
    /** below the lot */
    street: RoadSegment
    /** right of the lot */
    avenue?: RoadSegment
  }
}

export interface Hotel {
  avenue: number
  available: HotelSize
  opened: HotelSize | null
}

export enum HotelSize {
  Full = 'full',
  Partial = 'partial',
}

export enum RedCarpet {
  Mob = 'Mob',
  Fountain = 'Fountain',
  VIP = 'VIP',
}

export interface StreetAvenueAddress {
  street: number
  avenue: number
}

export interface Intersection {
  id: number
  /** use the address that is above and left of the intersection */
  address: StreetAvenueAddress
  connectedRoads: RoadSegment[]
  hasTaxiStand: boolean
}

export interface RoadSegment {
  id: string
  /** use the address that is above or left of the road */
  address: StreetAvenueAddress
  orientation: 'STREET' | 'AVENUE'
  intersections: number[]
}
