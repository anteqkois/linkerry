import { ConnectorMetadata } from '@linkerry/connectors-framework'
import { H5 } from '@linkerry/ui-components/server'
import Image from 'next/image'
import { HTMLAttributes } from 'react'

export interface ConnectorDrawerHeaderProps extends HTMLAttributes<HTMLElement> {
  connectorMetadata: ConnectorMetadata
}

export const ConnectorDrawerHeader = ({ connectorMetadata }: ConnectorDrawerHeaderProps) => {
  return (
    <div className="w-full flex items-center justify-center gap-2 border-b border-border/80 bg-background/95 backdrop-blur py-2">
      <Image width={30} height={30} src={connectorMetadata.logoUrl} alt={connectorMetadata.displayName} />
      <div>
        <H5>{connectorMetadata.displayName}</H5>
      </div>
    </div>
  )
}
