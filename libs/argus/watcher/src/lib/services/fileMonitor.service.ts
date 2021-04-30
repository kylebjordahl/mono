import {
  BeforeApplicationShutdown,
  Injectable,
  OnApplicationBootstrap,
} from '@nestjs/common'
import * as Gun from 'gun'
import { relative } from 'path'
import { FileInstance, GunRoot, Host, Root } from '@argus/domain'
import * as imageThumbnail from 'image-thumbnail'
import { watch } from 'chokidar'
import { IGunChainReference } from 'gun/types/chain'
import { createHash } from 'crypto'
import { FSWatcher } from 'node:fs'
import { DbService } from './db.service'
import { HostService } from './host.service'

@Injectable()
export class FileMonitorService
  implements OnApplicationBootstrap, BeforeApplicationShutdown {
  private activeMonitors = new Map<string, FSWatcher>()

  constructor(private db: DbService, private host: HostService) {}

  async onApplicationBootstrap() {
    this.host.hostNodePairwise$.subscribe(async ([prev, current]) => {
      if (prev) {
        prev.get('roots').map().off()
        await this.stopAllWatchers()
      }
      current
        .get('roots')
        .map()
        .on((root) => this.scanNewRoot({ root, host: current }))
    })
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
  }) {
    const rootData = args.root
    const rootNode = this.db.project
      .back(-1)
      .get(rootData['#']) as IGunChainReference<Root>
    const watcher = watch(rootData.basePath, {
      alwaysStat: true,
      awaitWriteFinish: true,
      persistent: true,
      ignored: /(^|[/\\])\../, // ignore dotfiles
    })

    console.log('ready to scan', rootData.basePath)

    const getFileNode = (path: string) => {
      const address = relative(rootData.basePath, path)
      const file = this.db.project
        .get(`files`)
        .get(address)
        .put({ address } as FileInstance)
      console.log('Processed file', address)
      return file
    }

    watcher.on('add', async (path, stat) => {
      console.log(`Found [${path}]`)
      const file = getFileNode(path)
      const fileData = await file.then()
      rootNode.get('files').set(fileData)
      file.put({
        fileSizeMb: stat.size / (1024 * 1024),
        modifiedAt: stat.mtime.toISOString(),
        createdAt: stat.ctime.toISOString(),
      })
      file.get('roots').set(rootData)
      // make a thumbnail if its an image!
      const existingThumbnail = await file.get('thumbnailBase64').then()
      if (!existingThumbnail) {
        console.log(`Creating thumbnail for [${path}]`)
        const thumbnail = ((await imageThumbnail(path, {
          responseType: 'base64',
          height: 67,
          jpegOptions: {
            force: true,
            quality: 90,
          },
        } as any)) as unknown) as string
        file.put({ thumbnailBase64: thumbnail })
      } else {
        console.log(`Thumbnail already exists for [${path}]`)
      }
    })

    watcher.on('unlink', async (path) => {
      console.log(`Unlink [${path}]`)
      const file = getFileNode(path)
      const fileData = await file.then()
      rootNode.get('files').unset(fileData)
      file.get('roots').unset(rootData)
      this.db.project.get('files').get(path).put(null)
      // maybe this does everything we need?
      file.put(null)
    })

    this.activeMonitors.set(this.makeWatcherKey(rootData), watcher)
    return watcher
  }

  private makeWatcherKey(root: Root) {
    return root.basePath
  }
}
