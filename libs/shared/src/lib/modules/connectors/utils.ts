export const getPackageAliasForConnector = (params: GetPackageAliasForConnectorParams): string => {
  const { connectorName, connectorVersion } = params
  return `${connectorName}-${connectorVersion}`
}

export const getPackageSpecForConnector = (params: GetPackageSpecForConnectorParams): string => {
  const { connectorName, connectorVersion } = params

  return `npm:${connectorName}@${connectorVersion}`
  // switch (packageType) {
  // case PackageType.REGISTRY: {
  // return `npm:${connectorName}@${connectorVersion}`
  // }

  // case PackageType.ARCHIVE: {
  //     const archivePath = getPackageArchivePathForConnector({
  //         connectorName,
  //         connectorVersion,
  //         packageArchivePath,
  //     })

  //     return `file:${archivePath}`
  // }
  // }
}

export const getPackageArchivePathForConnector = (params: GetPackageArchivePathForConnectorParams): string => {
  const { connectorName, connectorVersion, packageArchivePath } = params
  return `${packageArchivePath}/${connectorName}/${connectorVersion}.tgz`
}

export const getConnectorAppNameFromConnectorPacakgeName = (pacakgeName: string): string => {
  return pacakgeName.slice(10)
}

export const builImageUrlFromConnectorPacakgeName = (pacakgeName: string): string => {
  const name = pacakgeName.slice(10)
  return `/images/connectors/${name}.png`
}

export const extractConnectorFromModule = <T>(params: ExtractConnectorFromModuleParams): T => {
  const { module, connectorName, connectorVersion } = params
  const exports = Object.values(module)

  for (const e of exports) {
    if (e !== null && e !== undefined && e.constructor.name === 'Connector') {
      return e as T
    }
  }

  throw new Error(`Can not extract connector data ${connectorName} ${connectorVersion}`)
}

type GetPackageAliasForConnectorParams = {
  connectorName: string
  connectorVersion: string
}

type GetPackageSpecForConnectorParams = {
  connectorName: string
  connectorVersion: string
  // packageArchivePath: string
}

type GetPackageArchivePathForConnectorParams = {
  connectorName: string
  connectorVersion: string
  packageArchivePath: string
}

type ExtractConnectorFromModuleParams = {
  module: Record<string, unknown>
  connectorName: string
  connectorVersion: string
}
