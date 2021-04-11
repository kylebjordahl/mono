// this is a simplified single file method!
import * as Gun from 'gun'
import 'gun/lib/unset'
import { machineIdSync } from 'node-machine-id'
import { program } from 'commander'
import { getArgusDb } from './app/argus.db'
import { scanRoot } from './app/scanRoot'

program
  .requiredOption('-p, --project <projectId>', 'project ID')
  .requiredOption('-r, --root <root>', 'root scan path')

program.parse()
;(async () => {
  const machineId = machineIdSync()
  const options = program.opts()
  const projectId = options.project
  const rootPath = options.root
  console.log(`working on project [${projectId}]`)
  console.log(`scanning path [${rootPath}]`)

  if (!rootPath && !projectId) {
    console.log(`missing required args`)
    process.exit(1)
  }

  const db = getArgusDb(projectId)

  const host = db.get(`hosts`).get(machineId).put({ key: machineId })
  const root = db.get('roots').get(rootPath).put({ basePath: rootPath })
  host.get('roots').set(root)

  const watcher = await scanRoot({ root, db })

  process.on('beforeExit', async () => {
    await watcher.close()
  })
})()
