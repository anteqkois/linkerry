import { ConnectorMetadataSummary } from '@linkerry/connectors-framework'
import { cn } from '@linkerry/ui-components/utils'
import Image from 'next/image'
import { HTMLAttributes, useCallback } from 'react'

export interface ConnectorReviewItemProps extends HTMLAttributes<HTMLElement> {
  connector: ConnectorMetadataSummary
  onClickConnector?: (connector: ConnectorMetadataSummary) => void
}

export const ConnectorReviewItem = ({ connector, className, onClickConnector, ...props }: ConnectorReviewItemProps) => {
  const handleClick = useCallback(() => {
    onClickConnector?.(connector)
  }, [connector])

  return (
    <div
      className={cn(
        'flex items-center gap-4 select-none leading-none rounded-md cursor-pointer p-2 transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
        className,
      )}
      {...props}
      onClick={handleClick}
    >
      <Image width={26} height={26} src={connector.logoUrl} alt={connector.displayName} />
      <div>
        <div className="flex items-center gap-1 text-sm md:text-lg font-medium leading-none">{connector.displayName}</div>
        <p className="line-clamp-2 text-xs md:text-sm md:leading-snug text-muted-foreground">{connector.description}</p>
      </div>
    </div>
  )
}
