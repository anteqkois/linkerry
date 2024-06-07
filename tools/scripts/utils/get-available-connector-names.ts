import { readdir } from 'fs/promises'

export const getAvailableConnectorNames = async (): Promise<string[]> => {
  const ignoredPackages = ['apps', 'dist']
  let packageNames: string[] = []

  const envConnectors = process.env.CONNECTORS
  if (envConnectors) packageNames = envConnectors.split(',')
  else packageNames = await readdir('libs/connectors')

  return packageNames.filter((p) => !ignoredPackages.includes(p))
}
