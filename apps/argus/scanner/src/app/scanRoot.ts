import { watch } from 'chokidar'
import type { FileInstance, Root } from '@kylebjordahl/argus/domain'
import type { ArgusDb } from './argus.db'
import { extname, relative } from 'path'
import { IGunChainReference } from 'gun/types/chain'
import * as imageThumbnail from 'image-thumbnail'

export async function scanRoot(arg: {
  root: IGunChainReference<Root>
  db: ArgusDb
}) {
  const { root, db } = arg
  const rootData = await root.then()
  const watcher = watch(rootData.basePath, {
    alwaysStat: true,
    awaitWriteFinish: true,
    persistent: true,
    ignored: /(^|[/\\])\../, // ignore dotfiles
  })

  console.log('ready to scan', rootData.basePath)

  const getFileNode = (path: string) => {
    const address = relative(rootData.basePath, path)
    const file = db
      .get(`files`)
      .get(address)
      .put({ address } as FileInstance)
    console.log('Processed file', address)
    return file
  }

  watcher.on('add', async (path, stat) => {
    console.log(`Found [${path}]`)
    const file = getFileNode(path)
    root.get('files').set(file)
    file.put({
      fileSizeMb: stat.size / (1024 * 1024),
      modifiedAt: stat.mtime.toISOString(),
      createdAt: stat.ctime.toISOString(),
    })
    file.get('roots').set(root)
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

  watcher.on('unlink', (path) => {
    console.log(`Unlink [${path}]`)
    const file = getFileNode(path)
    root.get('files').unset((file as unknown) as FileInstance)
  })

  return watcher
}
