import type { FileInstance } from './fileInstance.model'

export interface Root {
  basePath: string
  files?: FileInstance[]
}
