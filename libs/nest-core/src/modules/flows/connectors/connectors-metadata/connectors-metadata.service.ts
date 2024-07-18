import { ConnectorMetadata, ConnectorMetadataSummary } from '@linkerry/connectors-framework'
import {
  ConnectorPackage,
  ConnectorsMetadataGetManyQuery,
  ConnectorsMetadataGetOneQuery,
  CustomError,
  EXACT_VERSION_PATTERN,
  ErrorCode,
  Id,
  PackageType,
  PrivateConnectorPackage,
  PublicConnectorPackage,
  assertNotNullOrUndefined,
  isNil,
} from '@linkerry/shared'
import { Injectable, Logger, UnprocessableEntityException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'
import semVer from 'semver'
import { ConnectorsMetadataModel } from './schemas/connector.schema'

const increasePatchVersion = (version: string): string => {
  const incrementedVersion = semVer.inc(version, 'patch')
  if (isNil(incrementedVersion)) {
    throw new Error(`Failed to increase patch version ${version}`)
  }
  return incrementedVersion
}

const increaseMinorVersion = (version: string): string => {
  const incrementedVersion = semVer.inc(version, 'minor')
  if (isNil(incrementedVersion)) {
    throw new Error(`Failed to increase minor version ${version}`)
  }
  return incrementedVersion
}

const increaseMajorVersion = (version: string): string => {
  const incrementedVersion = semVer.inc(version, 'major')
  if (isNil(incrementedVersion)) {
    throw new Error(`Failed to increase major version ${version}`)
  }
  return incrementedVersion
}

@Injectable()
export class ConnectorsMetadataService {
  private readonly Logger = new Logger(ConnectorsMetadataService.name)

  constructor(@InjectModel(ConnectorsMetadataModel.name) private readonly connectorMetadataModel: Model<ConnectorsMetadataModel>) {}

  // TODO implement create for private connectors
  // TODO implement filter based on proectId

  connectorToSummaryMetadata(connectorMetadata: ConnectorMetadata): ConnectorMetadataSummary {
    return {
      ...connectorMetadata,
      actions: Object.keys(connectorMetadata?.actions ?? {}).length,
      triggers: Object.keys(connectorMetadata?.triggers ?? {}).length,
    }
  }

  async findAllUnique(query: ConnectorsMetadataGetManyQuery) {
    const filter: FilterQuery<ConnectorMetadata> = {}

    if (query.displayName)
      filter.displayName = {
        $regex: new RegExp(query.displayName, 'i'),
      }

    const connectors = (
      await this.connectorMetadataModel.find(
        filter,
        {},
        {
          limit: query.limit,
          skip: query.offset,
          sort: {
            name: 'asc',
            version: 'desc',
          },
        },
      )
    ).map((connector) => connector.toObject())

    const distinctConnectors = Array.from(
      connectors
        .reduce((acc: Map<string, ConnectorMetadata>, curr) => {
          if (acc.has(curr.name)) return acc
          acc.set(curr.name, curr)
          return acc
        }, new Map())
        .values(),
    )

    return query.summary ? distinctConnectors.map((connector) => this.connectorToSummaryMetadata(connector)) : distinctConnectors
  }

  // TODO handle projectId when custom connectors will be aded
  async findOne(name: string, query: ConnectorsMetadataGetOneQuery) {
    const filter: FilterQuery<ConnectorsMetadataModel> = {
      name,
    }

    if (query.version) filter.version = query.version

    const connector = (
      await this.connectorMetadataModel.findOne(
        filter,
        {},
        {
          sort: {
            // TODO should be sorted by version, but mongo sort don't work with semntic version
            _id: -1,
          },
        },
      )
    )?.toObject()

    if (!connector) throw new UnprocessableEntityException(`Can not find conector metadata`)

    return query.summary ? this.connectorToSummaryMetadata(connector) : connector
  }

  async getTrigger(connectorName: string, triggerName: string) {
    const connector = await this.connectorMetadataModel.findOne(
      {
        name: connectorName,
      },
      {},
      {
        sort: {
          _id: -1,
        },
      },
    )
    assertNotNullOrUndefined(connector, `connector connectorName=${connectorName}`)

    console.log(connector.triggers)
    const trigger = Object.entries(connector.triggers).find(([name]) => name === triggerName)?.[1]
    console.log(trigger)
    assertNotNullOrUndefined(trigger, 'trigger', {
      connector,
      connectorName,
      triggerName,
    })

    return trigger
  }

  findNextExcludedVersion(version: string | undefined): { baseVersion: string; nextExcludedVersion: string } | undefined {
    if (version?.startsWith('^')) {
      const baseVersion = version.substring(1)
      return {
        baseVersion,
        nextExcludedVersion: increaseMajorVersion(baseVersion),
      }
    }
    if (version?.startsWith('~')) {
      const baseVersion = version.substring(1)
      return {
        baseVersion,
        nextExcludedVersion: increaseMinorVersion(baseVersion),
      }
    }
    if (isNil(version)) {
      return undefined
    }
    return {
      baseVersion: version,
      nextExcludedVersion: increasePatchVersion(version),
    }
  }

  async getExactConnectorVersion({ name, version, projectId }: GetExactConnectorVersionParams): Promise<string> {
    const isExactVersion = EXACT_VERSION_PATTERN.test(version)

    if (isExactVersion) {
      return version
    }

    this.Logger.warn(`Can not get exact connector version`, {
      name,
      version,
    })
    // TODO implement filter based on projectId like in ac /Users/anteqkois/Code/Projects/me/activepieces/packages/server/api/src/app/pieces/piece-metadata-service/db-piece-metadata-service.ts constructPieceFilters

    const pieceMetadata = await this.findOne(name, {
      version,
    })

    return pieceMetadata.version
  }

  async getConnectorPackage(projectId: string, pkg: PublicConnectorPackage | Omit<PrivateConnectorPackage, 'archiveId'>): Promise<ConnectorPackage> {
    switch (pkg.packageType) {
      case PackageType.ARCHIVE: {
        // TODO implement private connectors
        // const pieceMetadata = await pieceMetadataService.getOrThrow({
        //     name: pkg.pieceName,
        //     version: pkg.pieceVersion,
        //     projectId,
        // })
        // return {
        //     packageType: PackageType.ARCHIVE,
        //     pieceName: pkg.pieceName,
        //     pieceVersion: pkg.pieceVersion,
        //     pieceType: pkg.pieceType,
        //     archiveId: pieceMetadata.archiveId!,
        // }
        throw new CustomError('PackageType.ARCHIVE not implemented', ErrorCode.CONNECTOR_NOT_FOUND)
      }
      case PackageType.REGISTRY: {
        return pkg
      }
    }
  }
}

type GetExactConnectorVersionParams = {
  name: string
  version: string
  projectId: Id
}
