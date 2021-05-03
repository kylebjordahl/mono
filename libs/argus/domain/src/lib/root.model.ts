import type { FileInstance } from './fileInstance.model'
import { Host } from './host.model'

export interface Root {
  basePath: string
  host: Host

  swarmKey: string
  p2pPeerId: string
  /** JSON stringified array of multiaddrs for this node */
  multiaddrs: string

  files?: FileInstance[]
}
