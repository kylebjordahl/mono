import { ChangeDetectorRef, Component } from '@angular/core'
import { Version, Host } from '@kylebjordahl/argus/domain'
import { Subject } from 'rxjs'
import { GunService } from '../services/gun.service'

@Component({
  selector: 'kylebjordahl-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page {
  hosts = new Map<string | number | symbol, Host>()
  private unsubscribe$ = new Subject<void>()
  constructor(private gun: GunService, private changeRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.gun.db.get('hosts').open((data) => {
      console.log('hosts', data)
      Object.entries(data)
        .filter((id, host) => !!host)
        .map((entry) => this.hosts.set(...entry))
      this.changeRef.detectChanges()
    })
  }

  ngOnDestroy() {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }
}
