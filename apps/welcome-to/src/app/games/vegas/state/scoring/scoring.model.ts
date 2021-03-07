import { StreetAvenueAddress } from '../properties/properties.models'

export enum ImprovementArea {
  Inauguration = 'Inauguration',
  FullHotel = 'FullHotel',
  PartialHotel = 'PartialHotel',
  StreetScoring = 'StreetScoring',
  Par3 = 'Par3',
  Par4 = 'Par4',
  Par5 = 'Par5',
  Vip = 'Vip',
  Fountain = 'Fountain',
  LimoPenalty = 'LimoPenalty',
}

export const ScoringData = {
  show: {
    left: [0, 3.7, 11, 16, 21, 28],
    leftCash: [5, 6],
    right: [0, 3, 6, 9, 12, 15, 18],
    rightCash: [3, 4],
  },

  improvements: {
    [ImprovementArea.Inauguration]: [
      [15, 8, 0],
      [10, 5, 2],
    ],
    [ImprovementArea.FullHotel]: [3, 4, 5, 7, 9],
    [ImprovementArea.PartialHotel]: [1, 2, 2, 4, 6],
    [ImprovementArea.StreetScoring]: [4, 6, 8, 10],
    [ImprovementArea.Par3]: [1, 2, 2, 3],
    [ImprovementArea.Par4]: [2, 3, 3, 4],
    [ImprovementArea.Par5]: [3, 5, 7, 10],
    [ImprovementArea.Vip]: [3, 5, 7, 9],
    [ImprovementArea.Fountain]: [3, 4, 5, 7],
    [ImprovementArea.LimoPenalty]: [-10, -6, -3, -1],
  },

  debtPenalty: -20,
  inaugurationTrackGroupings: [2, 2, 2, 2, 2, 3, 1],
  inaugurationTrackBonusesAvailable: (completedCount) =>
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1]
      .slice(0, completedCount)
      .reduce((sum, curr) => sum + curr, 0),
}

// export enum InaugurationBonusType{
//   EasyOpen="EasyOpen",
//   FreeAction="FreeAction",
//   ExtendedCasino="ExtendedCasino",
// }

// export type InaugurationBonus = {
//   type: InaugurationBonusType.EasyOpen,
//   address: LotAddress,
//   casinoNumber
// }
