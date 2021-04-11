import type { Root } from './root.model'

export interface Host {
  name: string
  key: string
  roots: Root[]
}
