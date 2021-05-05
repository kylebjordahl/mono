import { ChangeDetectorRef, Component } from '@angular/core'
import { Version, Host } from '@argus/domain'
import { Subject } from 'rxjs'
import { GunService } from '../services/gun.service'
import { TransferService } from '../transfer/transfer.service'

@Component({
  selector: 'kylebjordahl-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page {
  hosts = new Map<string | number | symbol, Host>()
  private unsubscribe$ = new Subject<void>()
  constructor(
    private gun: GunService,
    private changeRef: ChangeDetectorRef,
    public transfer: TransferService
  ) {}

  ngOnInit() {
    this.gun.db.get('hosts').open((data) => {
      for (const [key, host] of Object.entries(data)) {
        if (host) {
          this.hosts.set(key, host)
        }
      }
      this.changeRef.detectChanges()
    })
  }

  ngOnDestroy() {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }
}
