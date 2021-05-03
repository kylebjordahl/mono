import { IGunChainReference } from 'gun/types/chain'

import { privateLibp2pNode } from './node.p2p'

import {
  FileInstance,
  GunRoot,
  Host,
  Root,
  TransferEvent,
  TransferStatus,
} from '@argus/domain'
import type { Connection, Multiaddr, MuxedStream } from 'libp2p'
import { pipe } from 'it-pipe'
import { decode, encode } from 'it-length-prefixed'
import * as Gun from 'gun'
import * as PeerId from 'peer-id'
import { getCleanMultiaddr } from 'libp2p/src/identify'
import 'gun/lib/bye'
import { ensureDir } from 'fs-extra'
import { join, dirname, relative } from 'path'
import { awaitSouls } from '../functions/utility/awaitSouls'
import { createReadStream, createWriteStream } from 'fs'
import { once } from 'events'
import { finished } from 'stream'
import { promisify } from 'util'

export async function setupP2p(args: {
  db: IGunChainReference<GunRoot>
  rootNode: IGunChainReference<Root>
  swarmKey: string
}) {
  // const swarmKeyStored = await args.db.get('swarmKey').then()
  // let swarmKey: Uint8Array
  // if (!swarmKey || swarmKeyStored.length < 1) {
  //   console.log('generating new swarm key')
  //   swarmKey = new Uint8Array(95)
  //   generate(swarmKey)
  //   await args.db.get('swarmKey').put(Buffer.from(swarmKey).toString('hex'))
  // } else {
  //   swarmKey = Buffer.from(swarmKeyStored)
  //   console.log('using graph swarm key')
  // }

  const swarmKey = Buffer.from(args.swarmKey, 'hex')
  console.log('connecting to p2p swarm', args.swarmKey)

  const node = await privateLibp2pNode({ swarmKey })

  await node.start()
  console.log(
    'p2p node ready!',
    node.peerId.toB58String(),
    node.multiaddrs.map((x) => x.toString()).join(', ')
  )

  args.rootNode.get('p2pPeerId').put(node.peerId.toB58String())
  args.rootNode
    .get('multiaddrs')
    .put(JSON.stringify(node.multiaddrs))
    .bye()
    .put(null)

  const root = await args.rootNode.then()

  node.handle(
    '/argus/request/1.0.0',
    (arg: {
      connection: Connection
      stream: MuxedStream
      protocol: string
    }) => {
      const { connection, stream, protocol } = arg

      pipe(stream, async (src) => {
        for await (const msg of src) {
          console.log(`[in ${root.basePath}] REQ`, msg.toString())
          const { stream: returnStream } = await node.dialProtocol(
            connection.remotePeer,
            '/argus/receive/1.0.0'
          )
          pipe(['this would be the file!'], encode(), returnStream.sink)
        }
      })
    }
  )

  node.handle(
    '/argus/receive/1.0.0/',
    (arg: {
      connection: Connection
      stream: MuxedStream
      protocol: string
    }) => {
      const { stream } = arg

      pipe(stream, decode(), async (src) => {
        const filePath = (await src.next()).value.toString()
        console.log(`[in ${root.basePath}] RCV`, 'HEADER', filePath)
        const targetPath = join(root.basePath, filePath)
        await ensureDir(dirname(targetPath))
        const outputStream = createWriteStream(targetPath, {
          autoClose: true,
        })
        for await (const chunk of src) {
          for (const buf of chunk._bufs as Buffer[]) {
            if (!outputStream.write(buf)) {
              await once(outputStream, 'drain')
            }
          }
        }
        outputStream.end()
        await promisify(finished)(outputStream)
        // await promisify(pipeline)(
        //   Readable.from(src, { encoding: 'utf-8' }),
        //   outputStream
        // )
      })
    }
  )

  args.db
    .get('roots')
    .map()
    .on(async (newRoot: Root, id) => {
      // don't loop back on ourselves
      if (newRoot.p2pPeerId === root.p2pPeerId) {
        return
      }

      if (!newRoot.p2pPeerId) {
        return
      }

      const peerId = PeerId.createFromB58String(newRoot.p2pPeerId)

      const multiAddrs: Multiaddr[] | undefined = newRoot.multiaddrs
        ? JSON.parse(newRoot.multiaddrs).map((addr) => getCleanMultiaddr(addr))
        : undefined

      if (!multiAddrs) {
        // host is offline
        return
      }
      node.peerStore.addressBook.set(peerId, multiAddrs)

      await node.dial(peerId)
    })

  args.db.get('transfers').time((data) => {
    args.db
      .back(-1)
      .get(data['#'])
      .once(async (x: TransferEvent) => {
        if (typeof x !== 'number') {
          if (
            x.sender === Gun.node.soul(root as any) &&
            x.status === TransferStatus.NOT_STARTED
          ) {
            // we are sending!
            let fileIds = []
            try {
              fileIds = JSON.parse(x.fileIds)
            } catch {
              /** */
            }
            const files = await awaitSouls<FileInstance>({
              db: args.db,
              souls: fileIds,
            })
            const sendingRootNode = args.db
              .back(-1)
              .get(x.sender) as IGunChainReference<Root>
            const basePath = await sendingRootNode.get('basePath').then()
            const fullFilePaths = files.map((file) => {
              // find the path in the root with this file
              return join(basePath, file.address)
            })
            let receivers = []
            try {
              receivers = JSON.parse(x.receivers)
            } catch (e) {
              console.log(`[ERROR] while parsing receivers: ${e}`)
            }
            if (receivers.length === 0) {
              return
            }
            const receivingRoots = await awaitSouls<Root>({
              db: args.db,
              souls: receivers,
            })
            // const hosts = R.groupBy(R.path(['host', '#']), receivingRoots)
            // const localRoots = hosts[hostSoul]
            // if (localRoots?.length > 0) {
            //   // do local copies here
            //   const tasks = localRoots.flatMap((targetRoot) =>
            //     files.map(async (file) => {
            //       const target = join(targetRoot.basePath, file.address)
            //       ensureDir(dirname(target))
            //       const transfer = execa('cp', [
            //         '-p',
            //         '-v',
            //         join(basePath, file.address),
            //         target,
            //       ])
            //       transfer.stdout.on('data', (data) => {
            //         console.log(
            //           `[${targetRoot.basePath}]`,
            //           `[${file.address}]`,
            //           data.toString()
            //         )
            //       })
            //       transfer.then(() =>
            //         console.log(
            //           `Successfully copied [${file.address}] to [${targetRoot.basePath}]`
            //         )
            //       )
            //     })
            //   )
            //   console.log(
            //     `Started [${tasks.length}] local file copy actions...`
            //   )
            //   Promise.all(tasks).then(() =>
            //     console.log(`All local file copy tasks completed!`)
            //   )
            // }
            // const receiverHosts = await Promise.all(receivers.map(rSoul =>{
            //   const rootNode = args.db.back(-1).get(rSoul) as IGunChainReference<Root>
            //   const rootUuid
            // }))

            // fullFilePaths.forEach(async (filePath) => {
            //   console.log('-->sending file', filePath)
            //   const fp = createReadStream(filePath)

            receivingRoots.map(async (root) => {
              const { stream } = await node.dialProtocol(
                PeerId.createFromB58String(root.p2pPeerId),
                '/argus/receive/1.0.0/'
              )
              fullFilePaths.forEach((filePath, idx) => {
                const fp = createReadStream(filePath, { autoClose: true })
                pipe(
                  fp,
                  // fullFilePaths,
                  async function* (source) {
                    yield relative(basePath, filePath)
                    for await (const chunk of source) {
                      yield chunk
                    }
                  },
                  encode(),
                  stream
                )
              })
              // pipe(fp, encode(), stream)
            })
            // })
          }
        }
      })
  }, 1)
}
