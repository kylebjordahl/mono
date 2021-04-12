import { Version } from './version.model'

export interface Asset {
  stem: string

  /** in this object, the keys are the version identifiers */
  versions: Record<string, Version>
}
