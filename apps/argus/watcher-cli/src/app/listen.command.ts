import { Logger } from '@nestjs/common'
import { Command, Console } from 'nestjs-console'
import { DbService, getRootId, HostService, RootService } from '@argus/watcher'
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
    private logger: Logger,
    private rootService: RootService
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
    this.db.project.get('swarmKey').put(swarmKey)
    await this.host.assertHost()
    this.logger.log(`Setting up [${rootPaths.length}] root paths`)
    // const host = await hostNode.then()
    rootPaths.map(async (rootPath) => {
      await this.rootService.assertRoot({ basePath: rootPath })
    })
  }
}
