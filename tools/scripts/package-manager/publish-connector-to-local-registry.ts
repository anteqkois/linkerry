import { getAvailableConnectorNames } from '../utils/get-available-connector-names'
import { publishNxProject } from './publish-nx-project'

const publishConnector = async (connectorName: string): Promise<void> => {
	// console.info(`[publishConnector] connectorName=${connectorName}`)
	const nxProjectPath = `libs/connectors/${connectorName}`
	await publishNxProject(nxProjectPath)
	console.log()
}

const main = async () => {
	const connectorNames = await getAvailableConnectorNames()
	const publishResults = connectorNames.map((p) => publishConnector(p))
	await Promise.all(publishResults)
}

main()
