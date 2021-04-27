import { Injectable } from '@angular/core'
import {
  FileInstance,
  Root,
  TransferEvent,
  TransferStatus,
  WithGunSoul,
} from '@kylebjordahl/argus/domain'
import type { IGunChainReference } from 'gun/types/chain'
import { GunService } from '../services/gun.service'
import * as R from 'ramda'
import * as Gun from 'gun/gun'

@Injectable({
  providedIn: 'root',
})
export class TransferService {
  constructor(private gun: GunService) {
    this.gun.db.get('transfers').time((data, key, time) => {
      this.gun.db
        .back(-1)
        .get(data['#'])
        .once((x) => console.log('transfer created', x))
    })
  }

  async initiateTransfer(fileSoul: string) {
    const fileNode = this.gun.db
      .back(-1)
      .get(fileSoul as string) as IGunChainReference<FileInstance>
    const rootsWithFile = await fileNode.get('roots').then()
    const allRoots = await this.gun.db.get('roots').then()

    const filterRootKeys = R.pipe(
      R.toPairs,
      R.filter(([k]) => k !== '_'),
      R.map(([_, r]) => r['#'])
    )
    const rootsNeedingFile = R.symmetricDifference(
      filterRootKeys(allRoots) as string[],
      filterRootKeys(rootsWithFile) as string[]
    )
    if (rootsNeedingFile.length === 0) {
      return
    }
    const receivingRoots = await Promise.all(
      rootsNeedingFile.map(
        (rootSoul) => this.gun.db.back(-1).get(rootSoul).then() as Promise<Root>
      )
    )

    const senderRoot = (await this.gun.db
      .back(-1)
      .get(R.head(filterRootKeys(rootsWithFile) as string[]))
      .then()) as Root

    console.log('host', senderRoot.host)

    const transfer = this.gun.db.get('transfers').time({
      receivers: JSON.stringify(rootsNeedingFile),
      fileIds: JSON.stringify([fileSoul]),
      sender: Gun.node.soul(senderRoot as any),
      status: TransferStatus.NOT_STARTED,
      type: 'TRANSFER',
    })

    console.log('transfer start?')
  }
}
