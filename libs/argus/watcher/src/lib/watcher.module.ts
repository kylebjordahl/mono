import { Logger, Module } from '@nestjs/common'
import { DbService } from './services/db.service'
import { FileMonitorService } from './services/fileMonitor.service'
import { HostService } from './services/host.service'
import { VersionMatcherService } from './services/versionMatcher.service'
import { P2PService } from './services/p2p.service'
import { RootService } from './services/root.service'

@Module({
  providers: [
    FileMonitorService,
    DbService,
    HostService,
    VersionMatcherService,
    Logger,
    P2PService,
    RootService,
  ],
  exports: [DbService, HostService, FileMonitorService, RootService],
})
export class WatcherModule {}
