import type { Root } from './root.model'
import type { Version } from './version.model'

export interface FileInstance {
  address: string
  roots?: Root[]
  version?: Version
}
