import { ConnectorPackage, isEmpty } from '@market-connector/shared'
import { PackageInfo, packageManager } from '../../../lib/package-manager/package-manager'
import { getPackageAliasForConnector, getPackageSpecForConnector } from '../connectors/utils'

// const PACKAGE_ARCHIVE_PATH = system.getOrThrow(SystemProp.PACKAGE_ARCHIVE_PATH)

export abstract class ConnectorManager {
    // private readonly baseArchivePath = resolve(PACKAGE_ARCHIVE_PATH)

    async install({ projectPath, connectors }: InstallParams): Promise<void> {
        try {
            if (isEmpty(connectors)) {
                return
            }

            await packageManager.init({
                path: projectPath,
            })

            const uniqueConnectors = this.removeDuplicatedConnectors(connectors)

            await this.installDependencies({
                projectPath,
                // projectId,
                connectors: uniqueConnectors,
            })
        }
        catch (error) {
						throw new Error(`Can not install connectors`)

            // const enrichedError = enrichErrorContext({
            //     error,
            //     key: contextKey,
            //     value: contextValue,
            // })

            // throw enrichedError
        }
    }

    // getProjectPackageArchivePath({ projectId }: GetProjectPackageArchivePathParams): string {
    //     return `${this.baseArchivePath}/${projectId}`
    // }

    protected abstract installDependencies(params: InstallParams): Promise<void>

    protected connectorToDependency(connector: ConnectorPackage): PackageInfo {
        const packageAlias = getPackageAliasForConnector({
            connectorName: connector.connectorName,
            connectorVersion: connector.connectorVersion,
        })

        // const projectPackageArchivePath = this.getProjectPackageArchivePath({
        //     projectId,
        // })

        const packageSpec = getPackageSpecForConnector({
            // packageType: connector.packageType,
            connectorName: connector.connectorName,
            connectorVersion: connector.connectorVersion,
            // packageArchivePath: projectPackageArchivePath,
        })

        return {
            alias: packageAlias,
            spec: packageSpec,
        }
    }

    private removeDuplicatedConnectors(connectors: ConnectorPackage[]): ConnectorPackage[] {
        return connectors.filter((connector, index, self) =>
            index === self.findIndex((p) => p.connectorName === connector.connectorName && p.connectorVersion === connector.connectorVersion),
        )
    }
}

type InstallParams = {
    // projectId: string
    projectPath: string
    connectors: ConnectorPackage[]
}

// type GetProjectPackageArchivePathParams = {
//     projectId: ProjectId
// }
