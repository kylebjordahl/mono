import { command } from 'execa'
import {
  FileInstance,
  GunRoot,
  Host,
  Root,
  TransferEvent,
  TransferStatus,
} from '@kylebjordahl/argus/domain'
import { IGunChainReference } from 'gun/types/chain'
import { basename, dirname, join, relative } from 'path'
import { platform, tmpdir } from 'os'
import { customAlphabet } from 'nanoid'
import * as execa from 'execa'
import { ArgusDb } from './argus.db'
import { ensureDir } from 'fs-extra'
import { awaitSouls } from './utility/awaitSouls'
import { inspect } from 'util'
import * as Gun from 'gun'
import * as R from 'ramda'

const nanoId = customAlphabet('0123456789abcdef', 8)

let receiver: execa.ExecaChildProcess

export async function setupFileMover(arg: {
  hostNode: IGunChainReference<Host>
  db: ArgusDb
}) {
  // let uuid = await arg.hostNode.get('uftpId').then()
  // if (!uuid) {
  //   uuid = nanoId()
  //   arg.hostNode.put({ uftpId: uuid })
  // }
  // console.log(`>>>>> TransferId [${uuid}]`)
  // const tempDir = join(tmpdir(), 'argus')
  // ensureDir(tempDir)
  // //-T ${tempDir}
  // receiver = command(
  //   `./uftpd -d -D /Users/kyle/Desktop/rcv-test -U ${uuid} -I 192.168.7.71 `,
  //   {
  //     cwd: 'apps/argus/scanner/src/bin/mac',
  //     localDir: 'apps/argus/scanner/src/bin/mac',
  //     preferLocal: true,
  //   }
  // )
  // receiver.stderr.on('data', (data) => {
  //   console.log('[RCVR-stderr]', data.toString())
  //   const fingerprint = data.toString().match(/fingerprint ([0-9A-F:]{59})/)
  //   if (fingerprint) {
  //     arg.hostNode.put({ uftpFingerprint: fingerprint[1] })
  //   }
  // })
  // receiver.stdout.on('data', (data) => {
  //   console.log('[RCVR-stdout]', data.toString())
  // })
  // const hostRoots = await arg.hostNode.get('roots').then()
  // const hostSoul = Gun.node.soul((await arg.hostNode.then()) as any)
  // arg.db.get('transfers').time((data) => {
  //   arg.db
  //     .back(-1)
  //     .get(data['#'])
  //     .once(async (x: TransferEvent, id) => {
  //       if (typeof x !== 'number') {
  //         if (
  //           R.keys(hostRoots).includes(x.sender as any) &&
  //           x.status === TransferStatus.NOT_STARTED
  //         ) {
  //           // we are sending!
  //           let fileIds = []
  //           try {
  //             fileIds = JSON.parse(x.fileIds)
  //           } catch {
  //             /** */
  //           }
  //           const files = await awaitSouls<FileInstance>({
  //             db: arg.db,
  //             souls: fileIds,
  //           })
  //           const sendingRootNode = arg.db
  //             .back(-1)
  //             .get(x.sender) as IGunChainReference<Root>
  //           const basePath = await sendingRootNode.get('basePath').then()
  //           const fullFilePaths = files.map((file) => {
  //             // find the path in the root with this file
  //             return join(basePath, file.address)
  //           })
  //           let receivers = []
  //           try {
  //             receivers = JSON.parse(x.receivers)
  //           } catch (e) {
  //             console.log(`[ERROR] while parsing receivers: ${e}`)
  //           }
  //           if (receivers.length === 0) {
  //             return
  //           }
  //           const receivingRoots = await awaitSouls<Root>({
  //             db: arg.db,
  //             souls: receivers,
  //           })
  //           const hosts = R.groupBy(R.path(['host', '#']), receivingRoots)
  //           console.log(hostSoul, '--->', hosts)
  //           const localRoots = hosts[hostSoul]
  //           if (localRoots?.length > 0) {
  //             // do local copies here
  //             const tasks = localRoots.flatMap((targetRoot) =>
  //               files.map(async (file) => {
  //                 const target = join(targetRoot.basePath, file.address)
  //                 ensureDir(dirname(target))
  //                 const transfer = execa('cp', [
  //                   '-p',
  //                   '-v',
  //                   join(basePath, file.address),
  //                   target,
  //                 ])
  //                 transfer.stdout.on('data', (data) => {
  //                   console.log(
  //                     `[${targetRoot.basePath}]`,
  //                     `[${file.address}]`,
  //                     data.toString()
  //                   )
  //                 })
  //                 transfer.then(() =>
  //                   console.log(
  //                     `Successfully copied [${file.address}] to [${targetRoot.basePath}]`
  //                   )
  //                 )
  //               })
  //             )
  //             console.log(
  //               `Started [${tasks.length}] local file copy actions...`
  //             )
  //             Promise.all(tasks).then(() =>
  //               console.log(`All local file copy tasks completed!`)
  //             )
  //           }
  //           // const receiverHosts = await Promise.all(receivers.map(rSoul =>{
  //           //   const rootNode = arg.db.back(-1).get(rSoul) as IGunChainReference<Root>
  //           //   const rootUuid
  //           // }))
  //           // const cmd = `---> uftp -U ${uuid} -E ${basePath} -H ${.join(
  //           //   ','
  //           // )} ${fullFilePaths.map((f) => `'${f}'`).join(' ')}`
  //           // console.log(cmd)
  //         }
  //       }
  //     })
  // }, 1)
}

const binFolder = <Record<NodeJS.Platform, string>>{
  darwin: 'mac',
}
