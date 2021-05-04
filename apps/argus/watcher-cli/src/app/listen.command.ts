import { Logger } from '@nestjs/common'
import { Command, Console } from 'nestjs-console'
import { DbService, getRootId, HostService } from '@argus/watcher'
import { IGunChainReference } from 'gun/types/chain'
import { Host, Root } from '@argus/domain'
import * as commander from 'commander'
import { take } from 'rxjs/operators'

import 'gun/lib/unset'
import 'gun/lib/time'
import 'gun/lib/open'
import 'gun/lib/then'

@Console()
export class ListenCommand {
  constructor(
    private db: DbService,
    private host: HostService,
    private logger: Logger // private p2p: P2PService
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

    this.db.project$.subscribe(async (project) => {
      const host = await this.host.host
      this.logger.log(`Setting up [${rootPaths.length}] root paths`)
      // const host = await hostNode.then()
      rootPaths.map(async (rootPath) => {
        this.logger.log(`Intializing root path [${rootPath}]`)
        const rootNode = project
          .get('roots')
          .get(getRootId({ basePath: rootPath, hostKey: host.key }))
          .put({
            basePath: rootPath,
            host: host,
            swarmKey,
          })
        const rootData = await rootNode.then()

        // this.logger.log(`Created root [${rootData.basePath}]`)
        project
          .get('hosts')
          .get(host.key)
          .get('roots')
          .get(rootPath)
          .put(rootNode as any)

        // this.p2p.setupPeer({ rootNode: root, swarmKey })
      })
    })
  }
}
