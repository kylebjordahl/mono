import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { DateTime, Duration, Interval } from 'luxon'
import { of, interval, merge } from 'rxjs'
import { map, shareReplay, switchMap } from 'rxjs/operators'
import * as R from 'ramda'
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class TogglService {
  readonly JN_PROJECT = 165482018
  readonly OHM_PROJECT = 167433806

  private raw$ = merge(of(0), interval(5 * 1000)).pipe(
    switchMap(() =>
      this.http.get<Entry[]>('/toggl/time_entries', {
        params: {
          start_date: DateTime.local().startOf('month').toISO(),
          end_date: DateTime.local().endOf('month').toISO(),
        },
        headers: {
          Authorization: `Basic ${btoa(environment.toggleApiKey)}`,
        },
      })
    ),
    shareReplay()
  )

  public month$ = this.raw$.pipe(
    map((x) => this.processEntries(x)),
    map((x) => [
      ...x,
      {
        id: 0,
        name: 'Target',
        value: this.monthTarget,
      },
    ])
  )

  public day$ = this.raw$.pipe(
    map((x) =>
      x.filter((y) =>
        Interval.after(DateTime.local().startOf('day'), { day: 1 }).contains(
          DateTime.fromISO(y.start)
        )
      )
    ),
    map((x) => this.processEntries(x)),
    map((x) => [
      ...x,
      {
        name: 'Target',
        value: this.dayTarget,
      },
    ])
  )

  readonly monthTarget: number
  readonly dayTarget = 4
  readonly monthMax: number
  constructor(private http: HttpClient) {
    this.monthTarget =
      this.countWeekdays(
        DateTime.local().startOf('month'),
        DateTime.local().endOf('day')
      ).length * this.dayTarget
    this.monthMax =
      this.countWeekdays(
        DateTime.local().startOf('month'),
        DateTime.local().endOf('month')
      ).length * this.dayTarget
  }

  private countWeekdays(start: DateTime, stop: DateTime): Interval[] {
    return Interval.fromDateTimes(start, stop)
      .splitBy(Duration.fromObject({ day: 1 }))
      .filter((d) => d.start.weekday < 6)
  }

  private processEntries(entries: unknown[]) {
    const fixInProgress = R.map((entry) => {
      return entry['stop']
        ? entry['duration']
        : Interval.fromDateTimes(
            DateTime.fromISO(entry['start']),
            DateTime.utc()
          ).count('seconds')
    })
    const grouped = R.groupBy(R.prop('pid'), entries)
    const summed = R.mapObjIndexed(
      (projectEntries) => R.sum(fixInProgress(projectEntries) as number[]),
      grouped
    )
    // return grouped[this.JN_PROJECT].filter((x) => x['duration'] < 0)
    return [
      {
        id: this.OHM_PROJECT,
        name: 'Ohm Connect',
        value: Duration.fromObject({ seconds: summed[this.OHM_PROJECT] }).as(
          'hours'
        ),
      },
      {
        id: this.JN_PROJECT,
        name: 'Just Networking',
        value: Duration.fromObject({ seconds: summed[this.JN_PROJECT] }).as(
          'hours'
        ),
      },
    ]
  }
}

export interface Entry {
  description: string
  start: string
  billable: boolean
  wid: number
  pid: number
  duration: number
  stop: string
  tags: string[]
  id: number
}
