import { Injectable, Logger } from '@nestjs/common'
import { DbService } from './db.service'
import { machineIdSync } from 'node-machine-id'
import { IGunChainReference } from 'gun/types/chain'
import { GunRoot, Host } from '@argus/domain'
import { map, pairwise, share, shareReplay, take, tap } from 'rxjs/operators'
import { merge, Observable, of } from 'rxjs'
import { hostname } from 'os'

const loggerContext = 'HostService'
@Injectable()
export class HostService {
  readonly machineId = machineIdSync()

  private _hostNode: IGunChainReference<Host>
  get hostNode(): IGunChainReference<Host> {
    return this._hostNode
  }

  get host(): Promise<Host> {
    return this._hostNode.then()
  }

  constructor(private db: DbService, private logger: Logger) {}

  assertHost(): IGunChainReference<Host> {
    this.logger.debug(
      `Creating host [${this.machineId}] in project`,
      loggerContext
    )
    const hostNode = this.db.project
      .get(`hosts`)
      .get(this.machineId)
      .put({ key: this.machineId, name: hostname() })

    hostNode.on((h) => {
      if (!h.name) {
        this.logger.verbose(`Resetting hostname`, loggerContext)
        hostNode.put({ name: hostname() })
      }
    })
    this.logger.debug(`Host node created for [${hostname()}]`, loggerContext)
    this._hostNode = hostNode
    return hostNode
  }
}
