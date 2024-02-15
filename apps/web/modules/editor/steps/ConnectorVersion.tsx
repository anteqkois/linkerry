import { ConnectorMetadata } from '@linkerry/connectors-framework'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@linkerry/ui-components/client'
import { Small } from '@linkerry/ui-components/server'
import { cn } from '@linkerry/ui-components/utils'
import { HTMLAttributes, useMemo } from 'react'
import { useClientQuery } from '../../../libs/react-query'
import { connectorsMetadataQueryConfig } from '../../flows/connectors/api/query-configs'

export interface ConnectorVersionProps extends HTMLAttributes<HTMLElement> {
	connectorMetadata: ConnectorMetadata
}

export const ConnectorVersion = ({ connectorMetadata, className }: ConnectorVersionProps) => {
	const { data: connectorsMetadata } = useClientQuery(connectorsMetadataQueryConfig.getSummaryMany())

	const theNewestConnectorVersion = useMemo(() => {
		if (!connectorsMetadata || !connectorMetadata) return ''
		return connectorsMetadata.find((metadata) => metadata.name === connectorMetadata.name)?.version ?? connectorMetadata.version
	}, [connectorsMetadata, connectorMetadata])

	return (
		<Small className={cn('p-1', connectorMetadata.version === theNewestConnectorVersion ? 'text-positive' : 'text-orange-400', className)}>
			<TooltipProvider delayDuration={200}>
				<Tooltip>
					<TooltipTrigger asChild>
						<Small className={cn('p-1', connectorMetadata.version === theNewestConnectorVersion ? 'text-positive' : 'text-orange-400')}>v.{connectorMetadata.version}</Small>
					</TooltipTrigger>
					<TooltipContent>
						<p>
							{connectorMetadata.version === theNewestConnectorVersion
								? `This is the newst version of ${connectorMetadata.name} connector`
								: `There is a newer version (${theNewestConnectorVersion}) of ${connectorMetadata.name} connector`}
						</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</Small>
	)
}
