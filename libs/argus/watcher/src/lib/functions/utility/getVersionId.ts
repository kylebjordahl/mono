import { DisguiseAsset } from '@lucidcreative/disguise-asset'

export function getVersionId(arg: { processedAsset: DisguiseAsset }): string {
  return `${arg.processedAsset.stem}::${arg.processedAsset.version ?? ''}`
}
