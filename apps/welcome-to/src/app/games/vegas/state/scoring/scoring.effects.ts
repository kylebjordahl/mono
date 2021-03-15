import { Injectable } from '@angular/core'
import { createEffect, Actions, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'

import { map, withLatestFrom } from 'rxjs/operators'

import { doInaugurationEvent } from './scoring.actions'
import { selectInaugurationTrackCount } from './scoring.selectors'
import { endGame } from '../game/game.actions'

@Injectable()
export class ScoringEffects {
  innaugurationEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(doInaugurationEvent),
      withLatestFrom(this.store.select(selectInaugurationTrackCount)),
      map(([_, count]) => {
        if (count >= 14) {
          console.log('ENDGAME!')
          return endGame()
        }
        return undefined
      })
    )
  )

  constructor(private actions$: Actions, private readonly store: Store) {}
}
