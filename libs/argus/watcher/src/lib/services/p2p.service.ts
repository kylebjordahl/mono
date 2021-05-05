import {
  BeforeApplicationShutdown,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common'
import { DbService } from './db.service'
import * as Gun from 'gun'
import { dirname, join, relative } from 'path'
import {
  FileInstance,
  Root,
  TransferEvent,
  TransferStatus,
} from '@argus/domain'
import 'gun/lib/bye'
import { IGunChainReference } from 'gun/types/chain'
import { createReadStream, createWriteStream } from 'fs'
import * as Libp2p from 'libp2p'
import type { Connection, Multiaddr, MuxedStream } from 'libp2p'
import { awaitSouls } from '../functions/utility/awaitSouls'
import pipe from 'it-pipe'
import { decode, encode } from 'it-length-prefixed'
import { ensureDir } from 'fs-extra'
import { once } from 'events'
import { promisify } from 'util'
import { finished } from 'stream'
import { createFromB58String } from 'peer-id'
import { privateLibp2pNode } from '../p2p/node.p2p'
import { getCleanMultiaddr } from 'libp2p/src/identify'
import { HostService } from './host.service'

const loggerContext = 'P2P'
@Injectable()
export class P2PService {
  constructor(
    private db: DbService,
    private host: HostService,
    private logger: Logger
  ) {}

  async setupPeer(args: { rootNode: IGunChainReference<Root> }) {
    const swarmKeyString = await this.db.project.get('swarmKey').then()
    if (!swarmKeyString) {
      return
    }
    const swarmKey = Buffer.from(swarmKeyString, 'hex')

    const node = await privateLibp2pNode({ swarmKey })
    await node.start()
    this.logger.log(
      `p2p node ready! [${node.peerId.toB58String()}]`,
      loggerContext
    )

    args.rootNode.get('p2pPeerId').put(node.peerId.toB58String())
    args.rootNode
      .get('multiaddrs')
      .put(JSON.stringify(node.multiaddrs))
      .bye()
      .put(null)

    const root = await args.rootNode.then()

    this.setupPeerHandlers({ node, root })

    this.db.project
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

        const peerId = createFromB58String(newRoot.p2pPeerId)

        const multiAddrs: Multiaddr[] | undefined = newRoot.multiaddrs
          ? JSON.parse(newRoot.multiaddrs).map((addr) =>
              getCleanMultiaddr(addr)
            )
          : undefined

        if (!multiAddrs) {
          // host is offline
          return
        }
        node.peerStore.addressBook.set(peerId, multiAddrs)

        await node.dial(peerId).catch((err) => {
          this.logger.warn(
            `Had an issue trying to initiate p2p connection with [${newRoot.basePath}]`,
            loggerContext
          )
        })
      })

    this.logger.verbose('subscribing transfers', loggerContext)
    this.db.project.get('transfers').time((data) => {
      this.db.project
        .back(-1)
        .get(data['#'])
        .once(async (x: TransferEvent) => {
          // this.logger.debug(`New transfer! [${data['#']}]`)
          console.log(x)
          if (typeof x !== 'number') {
            if (
              x.sender === Gun.node.soul(root as any) &&
              x.status === TransferStatus.NOT_STARTED
            ) {
              this.logger.verbose(`Handling transfer as sender`)
              // we are sending!
              let fileIds = []
              try {
                fileIds = JSON.parse(x.fileIds)
              } catch {
                /** */
              }
              const files = await awaitSouls<FileInstance>({
                db: this.db.project,
                souls: fileIds,
              })
              const sendingRootNode = this.db.project
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
                db: this.db.project,
                souls: receivers,
              })
              // // LOCAL TRANSFER!
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
                  createFromB58String(root.p2pPeerId),
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
    })
  }

  private setupPeerHandlers(arg: { node: Libp2p; root: Root }) {
    const { node, root } = arg
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
  }
}
