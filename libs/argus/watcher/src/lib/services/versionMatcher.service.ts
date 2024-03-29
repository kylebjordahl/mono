import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common'
import { IGunChainReference } from 'gun/types/chain'

import { FileInstance, GunRoot } from '@argus/domain'
import { DbService } from './db.service'
import { inspect } from 'util'
import { filenameToAsset } from '@lucidcreative/disguise-asset'
import { getVersionId } from '../functions/utility/getVersionId'

@Injectable()
export class VersionMatcherService {
  constructor(private db: DbService, private logger: Logger) {}

  start() {
    this.db.project
      .get('files')
      .map()
      .on((file) => this.processFile(file))
  }

  async processFile(file: FileInstance) {
    if (file.version) {
      this.logger.verbose(
        `Version already matched for [${file.address}]`,
        'VersionMatcher'
      )
      return
    }

    if (!file.address) {
      this.logger.warn(
        `Got file with no address! [${inspect(file)}]`,
        'VersionMatcher'
      )
      return
    }

    this.logger.log(`Matching version for [${file.address}]`, 'VersionMatcher')
    const processedAsset = filenameToAsset(file.address)

    const fileNode = this.db.project.get('files').get(file.address)

    if (processedAsset.proxyLevel) {
      fileNode.put({ proxyLevel: processedAsset.proxyLevel })
    }
    const assetNode = this.db.project.get('assets').get(processedAsset.stem)

    const asset = await assetNode.then()

    const versionTag = processedAsset.version ?? ''
    const versionId = getVersionId({ processedAsset })
    const versionNode = this.db.project.get('versions').get(versionId).put({
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
  }
}
