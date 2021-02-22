export interface Property {
  address: {
    street: number
    avenue: number
  }
  /** whether the casino has been constructed */
  isConstructed: boolean
  /** the casino number assigned in game */
  casinoNumber: number

  canHaveShow: boolean
  hasShow: boolean

  redCarpet: RedCarpet
  isLimoPassing: boolean

  /** null if no golf, otherwise par number */
  golfDefinition: number | null
  /** `null` if property is not yet opened, `true` if golf is linked, `false` if not linked after open */
  hasGolf: null | boolean
}

export enum RedCarpet {
  Mob,
  Fountain,
  VIP,
}
