import * as Gun from 'gun'
import { ArgusEvent, GunRoot } from '@kylebjordahl/argus/domain'
import { IGunChainReference } from 'gun/types/chain'

let gun: IGunChainReference<Record<string, GunRoot | ArgusEvent[]>>

export function getArgusDb(projectId: string): ArgusDb {
  if (!gun) {
    gun = Gun({
      peers: ['http://localhost:34567/gun'],
      radisk: false,
    })
  }

  return gun.get(projectId) as ArgusDb
}

export type ArgusDb = IGunChainReference<GunRoot>
