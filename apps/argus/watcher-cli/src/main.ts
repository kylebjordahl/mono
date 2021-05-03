/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { utilities, WinstonModule } from 'nest-winston'
import * as winston from 'winston'
import { BootstrapConsole } from 'nestjs-console'

import { AppModule } from './app/app.module'

// also do gun imports here, because why not
import 'gun/lib/unset'
import 'gun/lib/time'
import 'gun/lib/open'
import 'gun/lib/then'

const logger = WinstonModule.createLogger({
  exitOnError: false,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        utilities.format.nestLike('argus-watcher')
      ),
    }),
  ],
  level: 'info',
})

const bootstrap = new BootstrapConsole({
  module: AppModule,
  contextOptions: {
    logger,
  },
  useDecorators: true,
})
bootstrap.init().then(async (app) => {
  try {
    // init your app
    await app.init()
    // boot the cli
    await bootstrap.boot()
  } catch (e) {
    process.exit(1)
  }
})

async function bootstrapApi() {
  const app = await NestFactory.create(AppModule, {
    logger,
  })
  const globalPrefix = 'api'
  app.setGlobalPrefix(globalPrefix)
  const port = process.env.PORT || 3333
  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix)
  })
}
