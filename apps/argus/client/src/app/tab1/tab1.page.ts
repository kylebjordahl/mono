import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core'
import { Subject } from 'rxjs'
import { GunService } from '../services/gun.service'
import * as R from 'ramda'
import { Version, Asset } from '@kylebjordahl/argus/domain'

@Component({
  selector: 'kylebjordahl-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tab1Page implements OnInit, OnDestroy {
  assets = new Map<string | number | symbol, Asset>()
  versionThumbs = new Map<string, string>()
  private unsubscribe$ = new Subject<void>()
  constructor(private gun: GunService, private changeRef: ChangeDetectorRef) {
    window['assets'] = this.assets
  }

  ngOnInit() {
    this.gun.db
      .get('assets')
      .map()
      .once(async (data) =>
        this.gun.db
          .get('assets')
          .get(data.stem)
          .open((asset) => {
            console.log('updating', asset)
            this.assets.set(asset.stem, asset)

            this.gun.db
              .get('assets')
              .get(asset.stem)
              .get('versions')
              .map()
              .on((version) => {
                this.gun.db
                  .get('versions')
                  .get(version.key)
                  .get('files')
                  .map()
                  // TODO: improve this, it currently updates whenever any file updates
                  .on((file) => {
                    console.log(
                      'setting thumb for version',
                      file.thumbnailBase64
                    )
                    this.versionThumbs.set(version.key, file.thumbnailBase64)
                    this.changeRef.detectChanges()
                  })
              })

            // asset.latestVersion = R.head(Object.keys(asset.versions).sort())
            this.changeRef.detectChanges()
          })
      )
  }

  ngOnDestroy() {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

  getVersionThumb(version: Version): string {
    const data = this.versionThumbs.get(version.key)
    return `data:image/jpeg;base64,${data}`
  }
}
