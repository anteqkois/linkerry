import { ConnectorPackage } from '@linkerry/shared'
import { packageManager } from '../../../../lib/package-manager/package-manager'
import { ConnectorManager } from './base-manager'

export class RegistryConnectorManager extends ConnectorManager {
	// private override readonly logger = new Logger(RegistryConnectorManager.name)

	constructor(){
		super()
	}

	protected override async installDependencies({ projectPath, connectors }: InstallParams): Promise<void> {
		// await this.savePackageArchivesToDiskIfNotCached(projectId, connectors)
		const dependencies = connectors.map((connector) => this.connectorToDependency(connector))
		this.logger.debug(`#installDependencies dependencies:${JSON.stringify(dependencies)}`)

		await packageManager.add({
			path: projectPath,
			dependencies,
		})
	}

	// private async savePackageArchivesToDiskIfNotCached(projectId: string, connectors: ConnectorPackage[]): Promise<void> {
	//     const packages = await this.getUncachedArchivePackages(projectId, connectors)
	//     const saveToDiskJobs = packages.map((connector) => this.getArchiveAndSaveToDisk(projectId, connector))
	//     await Promise.all(saveToDiskJobs)
	// }

	// private async getUncachedArchivePackages(projectId: string, connectors: ConnectorPackage[]): Promise<ConnectorPackage[]> {
	//     const packages: ConnectorPackage[] = []

	//     for (const connector of connectors) {
	//         // if (connector.packageType !== PackageType.ARCHIVE) {
	//         //     continue
	//         // }

	//         const projectPackageArchivePath = this.getProjectPackageArchivePath({
	//             projectId,
	//         })

	//         const archivePath = getPackageArchivePathForConnector({
	//             connectorName: connector.connectorName,
	//             connectorVersion: connector.connectorVersion,
	//             packageArchivePath: projectPackageArchivePath,
	//         })

	//         if (await fileExists(archivePath)) {
	//             continue
	//         }

	//         packages.push(connector)
	//     }

	//     return packages
	// }

	// private async getArchiveAndSaveToDisk(projectId: string, connector: ConnectorPackage): Promise<void> {
	//     const archiveId = connector.archiveId ?? await this.getArchiveIdOrThrow(projectId, connector)

	//     const archiveFile = await fileService.getOneOrThrow({
	//         fileId: archiveId,
	//     })

	//     const projectPackageArchivePath = this.getProjectPackageArchivePath({
	//         projectId,
	//     })

	//     const archivePath = getPackageArchivePathForConnector({
	//         connectorName: connector.connectorName,
	//         connectorVersion: connector.connectorVersion,
	//         packageArchivePath: projectPackageArchivePath,
	//     })

	//     await mkdir(dirname(archivePath), { recursive: true })
	//     await writeFile(archivePath, archiveFile.data)
	// }

	// private async getArchiveIdOrThrow(projectId: string, connector: ConnectorPackage): Promise<string> {
	//     const connectorMetadata = await connectorMetadataService.getOrThrow({
	//         name: connector.connectorName,
	//         version: connector.connectorVersion,
	//         projectId,
	//     })

	//     if (isNil(connectorMetadata.archiveId)) {
	//         throw new ActiveconnectorsError({
	//             code: ErrorCode.CONNECTOR_NOT_FOUND,
	//             params: {
	//                 connectorName: connector.connectorName,
	//                 connectorVersion: connector.connectorVersion,
	//             },
	//         })
	//     }

	//     return connectorMetadata.archiveId
	// }
}

type InstallParams = {
	// projectId: string
	projectPath: string
	connectors: ConnectorPackage[]
}
