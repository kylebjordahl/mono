import type { Root } from './root.model'
import { GunNode, GunSet } from './utility'

export interface Host {
  name: string
  key: string
  roots: GunSet<Root>
}
