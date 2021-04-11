// this is a simplified single file method!
import * as Gun from 'gun'
import 'gun/lib/unset'
import { watch } from 'chokidar'
import { FileInstance, GunRoot } from '@kylebjordahl/argus/domain'
import { machineIdSync } from 'node-machine-id'
import { relative } from 'path'

const machineId = machineIdSync()

const rootPath = process.argv[2]

console.log(`scanning path [${rootPath}]`)

const gun = Gun<GunRoot>({
  peers: ['http://localhost:34567/gun'],
  radisk: false,
})

const host = gun.get(`hosts`).get(machineId).put({ key: machineId })
const root = gun.get('roots').get(rootPath).put({ basePath: rootPath })
host.get('roots').set(root)

const watcher = watch(rootPath, {
  persistent: true,
  ignored: /(^|[/\\])\../, // ignore dotfiles
})

function getFileNode(path: string) {
  const address = relative(rootPath, path)
  const file = gun
    .get(`files`)
    .get(address)
    .put({ address } as FileInstance)
  return file
}

watcher.on('add', (path, stat) => {
  console.log(`Found [${path}]`)
  const file = getFileNode(path)
  root.get('files').set(file)
  // file.get('roots').set(root)
})

watcher.on('unlink', (path) => {
  console.log(`Unlink [${path}]`)
  const file = getFileNode(path)
  root.get('files').unset((file as unknown) as FileInstance)
})
