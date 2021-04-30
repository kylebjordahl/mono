export function getRootId(arg: { basePath: string; hostKey: string }): string {
  return `${arg.hostKey}::${arg.basePath}`
}
