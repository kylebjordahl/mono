import { Logger } from '@nestjs/common'
import { Command, Console } from 'nestjs-console'
import { DbService, getRootId, HostService, P2PService } from '@argus/watcher'
import { IGunChainReference } from 'gun/types/chain'
import { Host, Root } from '@argus/domain'
import * as commander from 'commander'
import { take } from 'rxjs/operators'

@Console()
export class ListenCommand {
  constructor(
    private db: DbService,
    private host: HostService,
    private logger: Logger,
    private p2p: P2PService
  ) {
    this.logger.setContext('CLI')
  }

  @Command({
    command: 'listen <directories...>',
    options: [
      {
        flags: '-p, --projectId <projectId>',
        required: true,
      },
      {
        flags: '-k, --swarmKey <swarmKey>',
        required: true,
      },
    ],
  })
  async listen(
    rootPaths: string[],
    opts: {
      projectId: string
      swarmKey: string
    }
  ) {
    const { projectId, swarmKey } = opts

    this.logger.log(`Initializing for project [${projectId}]`)
    this.db.setProjectId(projectId)

    const host = await this.host.host

    this.host.hostNode$.pipe(take(1)).subscribe(async (hostNode) => {
      this.logger.log(`Setting up [${rootPaths.length}] root paths`)
      const hostKey = await hostNode.get('key').then()
      // const host = await hostNode.then()
      rootPaths.map(async (rootPath) => {
        this.logger.log(`Intializing root path [${rootPath}]`)
        const root = this.db.project
          .get('roots')
          .get(getRootId({ basePath: rootPath, hostKey }))
          .put({ basePath: rootPath, host: hostNode as any, swarmKey })
        hostNode.get('roots').set((root as unknown) as Root)

        this.p2p.setupPeer({ rootNode: root, swarmKey })
      })
    })
  }
}
