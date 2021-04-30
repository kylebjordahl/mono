import { Module } from '@nestjs/common'
import { DbService } from './services/db.service'
import { FileMonitorService } from './services/fileMonitor.service'
import { HostService } from './services/host.service'
import { VersionMatcherService } from './services/versionMatcher.service'

@Module({
  providers: [
    FileMonitorService,
    DbService,
    HostService,
    VersionMatcherService,
  ],
})
export class WatcherModule {}
