import { Asset } from './asset.model'
import type { FileInstance } from './fileInstance.model'

export interface Version {
  key: string
  versionTag: string
  frameIndex: number

  asset: Asset
  files: FileInstance[]
}
