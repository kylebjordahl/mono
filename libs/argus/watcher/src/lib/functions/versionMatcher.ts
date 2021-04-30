import { ArgusDb } from './argus.db'
import { filenameToAsset } from '@lucidcreative/disguise-asset'
import { getVersionId } from './utility/getVersionId'
import { inspect } from 'util'
import { FileInstance } from '../../../../../libs/argus/domain/src'

export function startVersionMatcher(arg: { db: ArgusDb }) {
  const { db } = arg
  db.get('files')
    .map()
    .on(async (file: FileInstance) => {
      if (file.version) {
        console.log(`Version already matched for [${file.address}]`)
        return
      }
      if (!file.address) {
        console.log(`Got file with no address! [${inspect(file)}]`)
        return
      }
      console.log(`Matching version for [${file.address}]`)
      const processedAsset = filenameToAsset(file.address)

      const fileNode = db.get('files').get(file.address)

      if (processedAsset.proxyLevel) {
        fileNode.put({ proxyLevel: processedAsset.proxyLevel })
      }
      const assetNode = db.get('assets').get(processedAsset.stem)

      const asset = await assetNode.then()

      const versionTag = processedAsset.version ?? ''
      const versionId = getVersionId({ processedAsset })
      const versionNode = db.get('versions').get(versionId).put({
        key: versionId,
        versionTag,
        asset,
      })

      fileNode.put({ version: versionNode as any })

      versionNode.get('files').set(fileNode as any)

      assetNode.put({ stem: processedAsset.stem })

      assetNode
        .get('versions')
        .get(versionTag)
        .put(versionNode as any)
    })
}
