import type { Root } from './root.model'
import type { Version } from './version.model'

export interface FileInstance {
  address: string
  fileSizeMb: number
  createdAt: string
  modifiedAt: string
  thumbnailBase64: string
  proxyLevel?: number | null

  // relations
  roots?: Root[]
  version?: Version
}
