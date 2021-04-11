import { Component } from '@angular/core'
import { GunService } from '../services/gun.service'

@Component({
  selector: 'kylebjordahl-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page {
  projectId = this.db.projectId

  constructor(private db: GunService) {}
}
