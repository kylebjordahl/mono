import { Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { map } from 'rxjs/operators'
import {
  cancelOfferBonusTypes,
  doInaugurationEvent,
  makeImprovements,
  offerInaugurationBonusTypes,
  useInaugurationBonus,
} from '../../state/scoring/scoring.actions'
import {
  ImprovementArea,
  InaugurationBonusType,
} from '../../state/scoring/scoring.model'

import {
  selectAvailableBonuses,
  selectCashAccounts,
  selectImprovements,
  selectInaugurationTrack,
  selectInaugurationTrackCount,
  selectScoringFeature,
  selectShowTracks,
} from '../../state/scoring/scoring.selectors'

@Component({
  selector: 'vegas-scoring',
  templateUrl: './scoring.component.html',
  styleUrls: ['./scoring.component.scss'],
})
export class ScoringComponent implements OnInit {
  // TEMPLATE ENUM
  ImprovementAreas = Object.values(ImprovementArea)
  selectedArea = ImprovementArea.Inauguration

  public BonusType = InaugurationBonusType

  cash$ = this.store.select(selectCashAccounts)

  improvement$ = this.store.select(selectImprovements)

  bonusAvailable$ = this.store.select(selectAvailableBonuses)
  inaugurationCount$ = this.store.select(selectInaugurationTrackCount)
  inaugurationTrack$ = this.store.select(selectInaugurationTrack)

  show$ = this.store.select(selectShowTracks)

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    //
  }

  doImprovement(area: ImprovementArea) {
    this.store.dispatch(makeImprovements({ area }))
  }

  onInaugurationStep() {
    this.store.dispatch(doInaugurationEvent())
  }

  onUseInaugurationBonus(box: {
    bonusAvailable: boolean
    bonusUsed: InaugurationBonusType
  }) {
    if (box.bonusAvailable && !box.bonusUsed) {
      // this is a stupidly bad way to do this...
      this.store.dispatch(offerInaugurationBonusTypes())
    }
  }

  cancelInaugurationBonus() {
    this.store.dispatch(cancelOfferBonusTypes())
  }

  chooseInaugurationBonus(bonus: InaugurationBonusType) {
    this.store.dispatch(useInaugurationBonus({ bonus }))
  }
}
