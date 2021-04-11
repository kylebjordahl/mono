import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core'
import { Subject } from 'rxjs'
import { GunService } from '../services/gun.service'

import { Version } from '@kylebjordahl/argus/domain'

@Component({
  selector: 'kylebjordahl-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tab1Page implements OnInit, OnDestroy {
  versions = new Map<string | number | symbol, Version>()
  private unsubscribe$ = new Subject<void>()
  constructor(private gun: GunService, private changeRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.gun.db
      .get('versions')
      .map()
      .on((data, id) => {
        console.log('updating', data)
        this.versions.set(id, data)
        this.changeRef.detectChanges()
      })
  }

  ngOnDestroy() {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }
}
