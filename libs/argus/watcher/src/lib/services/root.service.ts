import { Injectable, Logger } from '@nestjs/common'
import { getRootId } from '../functions'
import { DbService } from './db.service'
import { FileMonitorService } from './fileMonitor.service'
import { HostService } from './host.service'
import { P2PService } from './p2p.service'

const loggerContext = 'RootService'
@Injectable()
export class RootService {
  constructor(
    private host: HostService,
    private db: DbService,
    private logger: Logger,
    private p2p: P2PService,
    private fileMonitor: FileMonitorService
  ) {}

  async assertRoot(args: { basePath: string }) {
    const { basePath } = args
    const host = await this.host.host
    this.logger.log(`Intializing root path [${basePath}]`, loggerContext)
    const rootNode = this.db.project
      .get('roots')
      .get(getRootId({ basePath, hostKey: host.key }))
      .put({
        basePath: basePath,
        host: host,
      })
    const rootData = await rootNode.then()

    this.logger.log(`Created root [${rootData.basePath}]`)
    this.db.project
      .get('hosts')
      .get(host.key)
      .get('roots')
      .get(basePath)
      .put(rootNode as any)

    this.fileMonitor.scanNewRoot({ rootNode, rootData })
    this.p2p.setupPeer({ rootNode: rootNode })
  }
}
