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
  address: LotAddress
  property?: Property
}

export enum RedCarpet {
  Mob = 'Mob',
  Fountain = 'Fountain',
  VIP = 'VIP',
}

export interface LotAddress {
  street: number
  avenue: number
}
