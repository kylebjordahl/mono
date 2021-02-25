import { Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { map } from 'rxjs/operators'
import {
  doInaugurationEvent,
  makeImprovements,
  useInaugurationBonus,
} from '../../state/scoring/scoring.actions'
import { ImprovementArea } from '../../state/scoring/scoring.model'

import {
  selectAvailableScoringBonuses,
  selectImprovements,
  selectScoringFeature,
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

  score$ = this.store
    .select(selectScoringFeature)
    .pipe(map((x) => JSON.stringify(x, undefined, 2)))

  improvement$ = this.store.select(selectImprovements)

  bonusAvailable$ = this.store.select(selectAvailableScoringBonuses)

  constructor(private readonly store: Store) {
    console.log(this.ImprovementAreas)
  }

  ngOnInit(): void {
    //
  }

  onImprove() {
    this.store.dispatch(makeImprovements({ area: this.selectedArea }))
  }

  onInaugurationStep() {
    this.store.dispatch(doInaugurationEvent())
  }
  onUseInaugurationBonus() {
    this.store.dispatch(useInaugurationBonus())
  }
}
