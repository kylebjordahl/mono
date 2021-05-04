import { GunRoot } from '@argus/domain'
import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common'
import * as Gun from 'gun'
import { IGunChainReference } from 'gun/types/chain'
import { BehaviorSubject, Observable, Subject } from 'rxjs'
import {
  filter,
  map,
  pairwise,
  shareReplay,
  takeUntil,
  tap,
} from 'rxjs/operators'

// also do gun imports here, because why not
import 'gun/lib/unset'
import 'gun/lib/time'
import 'gun/lib/open'
import 'gun/lib/then'

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
      tap((projectId) =>
        this.logger.log(`Project ID is set to [${projectId}]`, 'DB')
      ),
      map((projectId) => this._gun.get(projectId)),
      shareReplay(1)
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
      pairwise(),
      shareReplay(1)
    )
  }

  /**
   * Static instance of the project node
   *
   * **DO NOT USE THIS FOR LONG TERM SUBSCRIPTIONS** as it will not update when the project is changed
   */
  get project(): IGunChainReference<GunRoot> {
    if (!this._projectId$.value) {
      throw Error('PROJECT_ID_NOT_SET')
    }
    console.log('getting project', this._projectId$.value)
    return this._gun.get(this._projectId$.value)
  }

  private _projectId$ = new BehaviorSubject<string>(undefined)
  private unsubscribe$ = new Subject()

  constructor(private logger: Logger) {}

  onModuleDestroy() {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

  setProjectId(projectId: string) {
    this._projectId$.next(projectId)
  }
}
