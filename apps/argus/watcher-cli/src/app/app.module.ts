import { Logger, Module } from '@nestjs/common'

import { WatcherModule } from '@argus/watcher'
import { ListenCommand } from './listen.command'
import { ConsoleModule } from 'nestjs-console'

@Module({
  imports: [ConsoleModule, WatcherModule],
  controllers: [],
  providers: [ListenCommand, Logger],
})
export class AppModule {}
