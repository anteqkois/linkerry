import { readdir } from 'fs/promises'

export const getAvailableConnectorNames = async (): Promise<string[]> => {
  const ignoredPackages = ['apps', 'dist']
  const packageNames = await readdir('libs/connectors')
  return packageNames.filter((p) => !ignoredPackages.includes(p))
}
