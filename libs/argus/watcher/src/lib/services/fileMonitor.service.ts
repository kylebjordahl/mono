import {
  BeforeApplicationShutdown,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common'
import * as Gun from 'gun'
import { relative } from 'path'
import { FileInstance, GunRoot, Host, Root } from '@argus/domain'
import * as imageThumbnail from 'image-thumbnail'
import { FSWatcher, watch } from 'chokidar'
import { IGunChainReference } from 'gun/types/chain'
import { DbService } from './db.service'
import { HostService } from './host.service'
import { pathExists } from 'fs-extra'
import { combineLatest } from 'rxjs'

const loggerScope = 'FileMonitor'
@Injectable()
export class FileMonitorService
  implements OnApplicationBootstrap, BeforeApplicationShutdown {
  private activeMonitors = new Map<string, FSWatcher>()

  constructor(
    private db: DbService,
    private host: HostService,
    private logger: Logger
  ) {}

  async onApplicationBootstrap() {
    combineLatest([this.host.hostNodePairwise$, this.db.project$]).subscribe(
      async ([[prev, current], project]) => {
        if (prev) {
          this.logger.log(`Canceling old watchers`, loggerScope)
          prev.get('roots').map().off()
          await this.stopAllWatchers()
        }
        current
          .get('roots')
          .map()
          .on((root) => {
            this.scanNewRoot({ root, host: current, project })
          })
      }
    )
  }

  /** shut down all watchers when the application stops */
  async beforeApplicationShutdown() {
    await this.stopAllWatchers()
  }
  private async stopAllWatchers() {
    const tasks = [...this.activeMonitors.values()].map((watcher) => {
      watcher.close
    })
    await Promise.allSettled(tasks)
  }

  public async scanNewRoot(args: {
    root: Root
    host: IGunChainReference<Host>
    project: IGunChainReference<GunRoot>
  }) {
    const rootData = args.root
    if (!rootData.basePath) {
      return
    }
    if (this.activeMonitors.has(this.makeWatcherKey(args.root))) {
      this.logger.debug(`already scanning [${rootData.basePath}]`, loggerScope)
      return
    }

    if (!pathExists(rootData.basePath)) {
      this.logger.warn(
        `path [${rootData.basePath}] does not exist!`,
        loggerScope
      )
    }
    const rootNode = args.host.get('roots').get(args.root.basePath)

    const watcher = watch(rootData.basePath, {
      alwaysStat: true,
      awaitWriteFinish: true,
      persistent: true,
      ignored: /(^|[/\\])\../, // ignore dotfiles
    })

    this.logger.debug(
      `Setting up watcher for [${rootData.basePath}]`,
      loggerScope
    )

    const getFileNode = (path: string) => {
      const address = relative(rootData.basePath, path)
      const file = args.project
        .get(`files`)
        .get(address)
        .put({ address } as FileInstance)
      this.logger.debug(`Processed file [${address}]`, loggerScope)
      return file
    }

    watcher.on('add', async (path, stat) => {
      this.logger.log(`Found [${path}]`, loggerScope)
      const file = getFileNode(path)
      const fileData = await file.then()
      rootNode.get('files').set(file as any)
      file.put({
        fileSizeMb: stat.size / (1024 * 1024),
        modifiedAt: stat.mtime.toISOString(),
        createdAt: stat.ctime.toISOString(),
      })
      file.get('roots').set(rootData)
      // make a thumbnail if its an image!
      const existingThumbnail = await file.get('thumbnailBase64').then()
      if (!existingThumbnail) {
        const thumbnail = await this.generateThumbnail(path)
        file.put({ thumbnailBase64: thumbnail })
      } else {
        this.logger.debug(`Thumbnail already exists for [${path}]`, loggerScope)
      }
    })

    watcher.on('unlink', async (path) => {
      this.logger.debug(`Unlink [${path}]`, loggerScope)
      const file = getFileNode(path)
      const fileData = await file.then()
      rootNode.get('files').unset(fileData)
      file.get('roots').unset(rootData)
      args.project.get('files').get(path).put(null)
      // maybe this does everything we need?
      file.put(null)
    })

    this.logger.log(`ready to scan [${rootData.basePath}]`, loggerScope)
    this.activeMonitors.set(this.makeWatcherKey(rootData), watcher)
    return watcher
  }

  private makeWatcherKey(root: Root) {
    return root.basePath
  }

  private async generateThumbnail(path) {
    this.logger.debug(`Creating thumbnail for [${path}]`, loggerScope)
    const thumbnail = ((await imageThumbnail(path, {
      responseType: 'base64',
      height: 67,
      jpegOptions: {
        force: true,
        quality: 90,
      },
    } as any)) as unknown) as string

    return thumbnail
  }
}
