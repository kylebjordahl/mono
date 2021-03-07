import { Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { reset } from './state/game/game.actions'

@Component({
  selector: 'welcome-to-vegas',
  templateUrl: './vegas.component.html',
  styleUrls: ['./vegas.component.scss'],
})
export class VegasComponent implements OnInit {
  constructor(private store: Store) {}

  ngOnInit(): void {
    //
  }

  resetGame() {
    this.store.dispatch(reset())
  }
}
