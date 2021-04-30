import { GunRoot } from '@argus/domain'
import { Injectable, OnModuleDestroy } from '@nestjs/common'
import * as Gun from 'gun'
import { IGunChainReference } from 'gun/types/chain'
import { BehaviorSubject, Observable, Subject } from 'rxjs'
import { filter, map, pairwise, takeUntil } from 'rxjs/operators'

// also do gun imports here, because why not
import 'gun/lib/unset'
import 'gun/lib/time'
import 'gun/lib/open'

@Injectable()
export class DbService implements OnModuleDestroy {
  private _gun = Gun<Record<string, GunRoot>>({
    // TODO: make this not localhost!
    peers: ['http://localhost:34567/gun'],
    radisk: false,
  })

  /**
   * the db will emit a new gun db node each time the project is changed
   */
  get project$(): Observable<IGunChainReference<GunRoot>> {
    return this._projectId$.pipe(
      takeUntil(this.unsubscribe$),
      filter((x) => !!x),
      map((projectId) => this._gun.get(projectId))
    )
  }

  /**
   * emits pairs of [prevProject, currentProject] where either may be undefined
   */
  get projectPairwise$(): Observable<
    [
      IGunChainReference<GunRoot> | undefined,
      IGunChainReference<GunRoot> | undefined
    ]
  > {
    return this._projectId$.pipe(
      takeUntil(this.unsubscribe$),
      map((projectId) => (projectId ? this._gun.get(projectId) : undefined)),
      pairwise()
    )
  }

  /**
   * Static instance of the project node
   *
   * **DO NOT USE THIS FOR LONG TERM SUBSCRIPTIONS** as it will not update when the project is changed
   */
  get project(): IGunChainReference<GunRoot> {
    return this._gun.get(this._projectId$.value)
  }

  private _projectId$ = new BehaviorSubject<string>(undefined)
  private unsubscribe$ = new Subject()

  onModuleDestroy() {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

  setProjectId(projectId: string) {
    this._projectId$.next(projectId)
  }
}
