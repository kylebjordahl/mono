import { Asset } from './asset.model'
import { FileInstance } from './fileInstance.model'
import type { Host } from './host.model'
import { Root } from './root.model'
import type { Version } from './version.model'

export interface GunRoot {
  hosts: Record<string, Host>
  roots: Record<string, Root>
  files: Record<string, FileInstance>
  versions: Record<string, Version>
  assets: Record<string, Asset>
}
