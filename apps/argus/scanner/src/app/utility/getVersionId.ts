import { DisguiseAsset } from '@lucidcreative/disguise-asset/dist'

export function getVersionId(arg: { processedAsset: DisguiseAsset }): string {
  return `${arg.processedAsset.stem}::${arg.processedAsset.version ?? ''}`
}
