import type { FileInstance } from './fileInstance.model'

export interface Version {
  key: string
  files: Record<string, FileInstance>
}
