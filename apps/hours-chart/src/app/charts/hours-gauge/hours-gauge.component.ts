import { Component, Input, OnInit } from '@angular/core'
import { BehaviorSubject, Observable, Subject } from 'rxjs'
import { filter, map, switchMap } from 'rxjs/operators'
import { TogglService } from '../../services/toggl.service'

@Component({
  selector: 'kb-hours-gauge',
  templateUrl: './hours-gauge.component.html',
  styleUrls: ['./hours-gauge.component.scss'],
})
export class HoursGaugeComponent {
  @Input()
  set scale(v: 'month' | 'day') {
    this._scale$.next(v)
  }

  private _scale$ = new BehaviorSubject<'month' | 'day'>(null)
  data$ = this._scale$.pipe(
    filter((x) => !!x),
    switchMap((scale) =>
      scale === 'month' ? this.toggl.month$ : this.toggl.day$
    )
  )

  get max$(): Observable<number> {
    return this._scale$.pipe(
      map((scale) =>
        scale === 'month' ? this.toggl.monthMax : this.toggl.dayTarget
      )
    )
  }

  get target$(): Observable<number> {
    return this._scale$.pipe(
      map((scale) =>
        scale === 'month' ? this.toggl.monthTarget : this.toggl.dayTarget
      )
    )
  }

  view: any[] = [600, 400]
  legend: boolean = true
  legendPosition: string = 'below'
  colorScheme = {
    domain: [
      'var(--ion-color-primary)',
      'var(--ion-color-secondary)',
      'var(--ion-color-tertiary)',
    ],
  }

  constructor(public toggl: TogglService) {}

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)))
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)))
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)))
  }
}
