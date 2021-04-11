import { createServer } from 'http'
import * as Gun from 'gun'

const saveFile = 'apps/argus/watchtower/data'

const PORT = 34567

const server = createServer().listen(PORT)

const gun = Gun({
  web: server,
  radisk: true,
  file: saveFile,
})

console.log(`Relay peer started on port ${PORT} with /gun`)
console.log(`Saving to [${saveFile}]`)
