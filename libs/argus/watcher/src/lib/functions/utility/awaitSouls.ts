import { IGunChainReference } from 'gun/types/chain'
export function awaitSouls<T>(arg: {
  db: IGunChainReference
  souls: string[]
}): T[] {
  return Promise.all(
    arg.souls.map((soul) => arg.db.back(-1).get(soul).then())
  ) as any
}
