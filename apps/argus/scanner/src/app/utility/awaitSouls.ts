import { ArgusDb } from '../argus.db'
export function awaitSouls<T>(arg: { db: ArgusDb; souls: string[] }): T[] {
  return Promise.all(
    arg.souls.map((soul) => arg.db.back(-1).get(soul).then())
  ) as any
}
