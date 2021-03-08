import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core'
import { Store } from '@ngrx/store'
import {
  Lot,
  HotelSize,
  RoadSegment,
} from '../../state/properties/properties.models'
import * as fromProperties from '../../state/properties/properties.selectors'
import * as fromLimo from '../../state/limo/limo.selectors'
import * as PropertyActions from '../../state/properties/properties.actions'
import * as GameActions from '../../state/game/game.actions'
import * as R from 'ramda'

import * as limoActions from '../../state/limo/limo.actions'
import { delay, shareReplay, take, takeUntil } from 'rxjs/operators'
import { interval, merge, of, Subject, Subscription } from 'rxjs'
import { IntersectionDirective } from './intersection.directive'

@Component({
  selector: 'vegas-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.scss'],
})
export class CityComponent implements AfterViewInit, OnDestroy {
  public HotelSize = HotelSize
  lots$ = this.store.select(fromProperties.selectLots)
  hotel$ = this.store.select(fromProperties.selectHotels)
  limoAddress$ = this.store.select(fromLimo.selectLimoLocation)
  isDrivingLimo$ = this.store
    .select(fromLimo.selectIsDriving)
    .pipe(shareReplay(1))
  limoPosition$ = new Subject<{ x: number; y: number }>()

  equals = R.equals

  @ViewChild('limo') limo: ElementRef<HTMLDivElement>
  @ViewChildren(IntersectionDirective, { read: ElementRef })
  intersectionWithLimo: QueryList<ElementRef<HTMLDivElement>>
  intersectionSubscription: Subscription

  constructor(
    private readonly store: Store,
    private host: ElementRef<HTMLElement>
  ) {}

  ngAfterViewInit() {
    this.intersectionSubscription = merge(
      this.intersectionWithLimo.changes,
      this.limoAddress$,
      interval(10).pipe(takeUntil(this.limoPosition$))
    )
      // .pipe(debounceTime(10))
      .subscribe(() => {
        this.placeLimo()
      })
  }
  ngOnDestroy() {
    this.intersectionSubscription.unsubscribe()
    this.limoPosition$.complete()
  }

  placeLotOnGrid(
    lot: Lot
  ): { gridColumn: number; gridRow: number } | undefined {
    try {
      return {
        gridColumn: lot?.address.avenue,
        gridRow: lot?.address.street,
      }
    } catch (err) {
      console.log(err, lot)
      return undefined
    }
  }

  placeLimo() {
    try {
      const rect = this.intersectionWithLimo
        .find((i) => i.nativeElement.classList.contains('has-limo'))
        .nativeElement.getBoundingClientRect()

      const centerX = rect.x + 0.5 * rect.width
      const centerY = rect.y + 0.5 * rect.height

      const limoRect = this.limo.nativeElement.getBoundingClientRect()
      const hostRect = this.host.nativeElement.getBoundingClientRect()
      const limoX = centerX - limoRect.width * 0.5 - hostRect.x
      const limoY = centerY - limoRect.height * 0.5

      if (limoX && limoY) {
        this.limoPosition$.next({ x: limoX, y: limoY })
      }
    } catch {
      //
    }
  }

  async limoClick() {
    const isDriving = await this.isDrivingLimo$.pipe(take(1)).toPromise()
    if (!isDriving) {
      this.store.dispatch(limoActions.startDrivingLimo())
    } else {
      this.store.dispatch(limoActions.cancelDrive())
    }
  }

  onDriveRoad(road: RoadSegment & { driveable: boolean }) {
    if (road.driveable) {
      this.store.dispatch(limoActions.driveRoad({ road }))
    }
  }

  onReset() {
    this.store.dispatch(GameActions.reset())
  }

  onHotelUnavailable(avenue: number) {
    this.store.dispatch(
      PropertyActions.changeHotelAvailability({
        avenue,
        available: HotelSize.Partial,
      })
    )
  }
}
