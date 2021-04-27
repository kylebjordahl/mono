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
  transfers: TransferEvent[]
  swarmKey: string
}

export type ArgusEvent = TransferEvent
export interface TransferEvent {
  type: 'TRANSFER'
  /** soul of the sending root */
  sender: string
  /** stringified array of receiving Root souls */
  receivers: string
  /** stringified array of FileInstance souls */
  fileIds: string
  status: TransferStatus
}

export enum TransferStatus {
  NOT_STARTED = 'Not Started',
  IN_PROGRESS = 'In Progress',
  COMPLETE = 'Complete',
  FAILED = 'Failed',
}

export interface WithGunSoul {
  ['#']: string
}
