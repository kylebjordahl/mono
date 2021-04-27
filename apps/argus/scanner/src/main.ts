// this is a simplified single file method!
import * as Gun from 'gun'
import 'gun/lib/unset'
import 'gun/lib/time'
import 'gun/lib/open'
import { machineIdSync } from 'node-machine-id'
import { program } from 'commander'
import { getArgusDb } from './app/argus.db'
import { scanRoot } from './app/scanRoot'
import { startVersionMatcher } from './app/versionMatcher'
import { setupFileMover } from './app/fileMover'
import { getVersionId } from './app/utility/getVersionId'
import { getRootId } from './app/utility/getRootId'
import { hostname } from 'os'
import { setupP2p } from './app/p2p/setup'

program
  .requiredOption('-p, --project <projectId>', 'project ID')
  .requiredOption(
    '-r, --root <root>',
    'root scan path',
    (val, list) => [...list, val],
    []
  )
  .requiredOption('-k --key <swarmKey>', 'swarm key for file sharing')
  .option(
    '-i --interface <ipAddress>',
    'the ip address to use for file transfers'
  )

program.parse()
;(async () => {
  const machineId = machineIdSync()
  const options = program.opts()
  const projectId = options.project as string
  const rootPaths = options.root as string[]
  const ipAddress = options.interface as string
  const swarmKey = options.key as string

  console.log(`working on project [${projectId}]`)

  if (!rootPaths && !projectId) {
    console.log(`missing required args`)
    process.exit(1)
  }

  const db = getArgusDb(projectId)

  const hostNode = db
    .get(`hosts`)
    .get(machineId)
    .put({ key: machineId, transferInterface: ipAddress })
  hostNode.on((h) => {
    if (!h.name) {
      hostNode.put({ name: hostname() })
    }
  })
  const host = await hostNode.then()
  // setupFileMover({ db, hostNode })
  startVersionMatcher({ db })

  const watchers = await Promise.all(
    rootPaths.map(async (rootPath) => {
      console.log(`scanning path [${rootPath}]`)
      const root = db
        .get('roots')
        .get(getRootId({ basePath: rootPath, hostKey: machineId }))
        .put({ basePath: rootPath, host })
      hostNode.get('roots').set(root)
      const watcher = await scanRoot({ root, db }).catch((err) => {
        console.log(`[ERROR] While watching [${rootPath}]:${err}`)
        return null
      })
      setupP2p({ db, rootNode: root, swarmKey })
      return watcher
    })
  ).then((x) => x.filter((y) => !!y))

  process.on('beforeExit', async () => {
    await Promise.allSettled(watchers.map((watcher) => watcher.close()))
  })
})()
