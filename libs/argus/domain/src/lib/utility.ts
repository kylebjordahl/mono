import type { IGunChainReference } from 'gun/types/chain'

export type GunNode<T, TKey extends string = string> =
  | T
  | IGunChainReference<T, TKey, false>

export type GunSet<T, TKey extends string = string> =
  | GunNode<T, TKey>
  | GunNode<T, TKey>[]
