import { Injectable, Logger } from '@nestjs/common'
import { DbService } from './db.service'
import { machineIdSync } from 'node-machine-id'
import { IGunChainReference } from 'gun/types/chain'
import { GunRoot, Host } from '@argus/domain'
import { map, pairwise, share, shareReplay, take, tap } from 'rxjs/operators'
import { merge, Observable, of } from 'rxjs'
import { hostname } from 'os'

@Injectable()
export class HostService {
  readonly machineId = machineIdSync()

  private _hostNode$: Observable<
    IGunChainReference<Host>
  > = this.db.project$.pipe(
    map((projectNode) => this.makeHostNode(projectNode)),
    shareReplay(1)
  )

  get hostNode$(): Observable<IGunChainReference<Host>> {
    return this._hostNode$.pipe()
  }

  get hostNode(): Promise<IGunChainReference<Host>> {
    return this.hostNode$.toPromise()
  }

  private _hostNodePairwise$ = merge(of(undefined), this._hostNode$).pipe(
    pairwise<undefined | IGunChainReference<Host>>(),
    shareReplay(1)
  )
  get hostNodePairwise$(): Observable<
    [IGunChainReference<Host> | undefined, IGunChainReference<Host>]
  > {
    return this._hostNodePairwise$
  }

  get host(): Promise<Host> {
    return (this._hostNode$.pipe(take(1)).toPromise() as unknown) as Promise<
      Host
    >
  }

  constructor(private db: DbService, private logger: Logger) {
    this.logger.setContext('HostService')
    this._hostNode$.subscribe((hostNode) => {
      // set up a listener to reset the name of the host if it becomes null
      hostNode.on((h) => {
        if (!h.name) {
          this.logger.verbose(`Resetting hostname`)
          hostNode.put({ name: hostname() })
        }
      })
    })
  }

  private makeHostNode(
    project: IGunChainReference<GunRoot>
  ): IGunChainReference<Host> {
    this.logger.debug(`Creating host [${this.machineId}] in project`)
    const hostNode = project
      .get(`hosts`)
      .get(this.machineId)
      .put({ key: this.machineId, name: hostname() })

    this.logger.debug(`Host node created for [${hostname()}]`)
    return hostNode
  }
}
