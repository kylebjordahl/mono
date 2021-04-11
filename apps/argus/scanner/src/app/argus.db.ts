import * as Gun from 'gun'
import { GunRoot } from '@kylebjordahl/argus/domain'
import { IGunChainReference } from 'gun/types/chain'

let gun: IGunChainReference<Record<string, GunRoot>>

export function getArgusDb(projectId: string): ArgusDb {
  if (!gun) {
    gun = Gun<Record<string, GunRoot>>({
      peers: ['http://localhost:34567/gun'],
      radisk: false,
    })
  }

  return gun.get(projectId)
}

export type ArgusDb = IGunChainReference<GunRoot>
