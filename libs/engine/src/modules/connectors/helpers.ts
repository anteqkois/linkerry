export const loadConnectorModule = async ({ connectorName, connectorVersion }: LoadConnectorModuleParams) => {
  let packageName = connectorName
  if (connectorVersion)
    packageName = getPackageAlias({
      connectorName,
      connectorVersion,
    })

  // const module = await import(`${packageName}`)
  // const packageName = 'coingecko'
  // const module = await import(`@market-connector/connectors/${packageName}`)
  const module = await import('@market-connector/connectors/coingecko')
  if (!module) throw new Error(`Can not load module ${packageName}`)

  return module
}

export const getPackageAlias = ({ connectorName, connectorVersion }: ConnectorModuleSpec) => {
  return `${connectorName}-${connectorVersion}`
}

export const getPackageRegistry = ({ connectorName, connectorVersion }: ConnectorModuleSpec) => {
  return `${connectorName}@${connectorVersion}`
}

export const getPackageInstallCommand = ({ connectorName, connectorVersion }: ConnectorModuleSpec) => {
  const alias = getPackageAlias({ connectorName, connectorVersion })
  const registryName = getPackageRegistry({ connectorName, connectorVersion })
  return `${alias}@npm:${registryName}`
}

interface LoadConnectorModuleParams {
  connectorName: string
  connectorVersion?: string
}

interface ConnectorModuleSpec extends LoadConnectorModuleParams {
  connectorVersion: string
}
