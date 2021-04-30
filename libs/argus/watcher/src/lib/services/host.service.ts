import { Injectable } from '@nestjs/common'
import { DbService } from './db.service'
import { machineIdSync } from 'node-machine-id'
import { IGunChainReference } from 'gun/types/chain'
import { GunRoot, Host } from '@argus/domain'
import { map, pairwise, shareReplay } from 'rxjs/operators'
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
    // this is dumb, but it's basically a double layer promise...
    return this._hostNode$.toPromise().then((node) => node.then())
  }

  constructor(private db: DbService) {
    this._hostNode$.subscribe((hostNode) => {
      // set up a listener to reset the name of the host if it becomes null
      hostNode.on((h) => {
        if (!h.name) {
          hostNode.put({ name: hostname() })
        }
      })
    })
  }

  private makeHostNode(
    project: IGunChainReference<GunRoot>
  ): IGunChainReference<Host> {
    const hostNode = project
      .get(`hosts`)
      .get(this.machineId)
      .put({ key: this.machineId, name: hostname() })

    return hostNode
  }
}
