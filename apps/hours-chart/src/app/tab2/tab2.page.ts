import { Component } from '@angular/core'
import { pluck, sum } from 'ramda'
import { map } from 'rxjs/operators'
import { TogglService } from '../services/toggl.service'

@Component({
  selector: 'kylebjordahl-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page {
  data$ = this.toggl.month$.pipe(
    map((x) => {
      const dollars = x
        .filter((y) => y.id > 0)
        .map((y) => ({
          ...y,
          value: Math.round(
            y.value * (y.id === this.toggl.JN_PROJECT ? 110 : 100)
          ),
        }))
      return dollars.concat([
        {
          id: Infinity,
          name: 'Total',
          value: sum(pluck('value', dollars)),
        },
      ])
    })
  )

  colorScheme = {
    domain: [
      'var(--ion-color-primary)',
      'var(--ion-color-secondary)',
      'var(--ion-color-tertiary)',
    ],
  }

  constructor(private toggl: TogglService) {}
}
