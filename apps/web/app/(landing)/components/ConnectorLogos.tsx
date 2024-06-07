'use client'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@linkerry/ui-components/client'
import { cn } from '@linkerry/ui-components/utils'
import Image from 'next/image'
import { HTMLAttributes } from 'react'
import './connectorLogos.css'

const connectorNamesToShow = [
  'binance',
  'trading-view',
  'mexc',
  'openai',
  'discord',
  'telegram-bot',
  'google-sheets',
  'coingecko',
  'bybit',
  'stripe',
  'schedule',
  'kucoin',
  'storage',
  'fakturownia',
  // 'maxdata',
]

export interface ConnectorLogoProps extends HTMLAttributes<HTMLElement> {
  connectorName: string
}

const ConnectorLogo = ({ connectorName }: ConnectorLogoProps) => {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger>
          <Image width={45} height={45} key={connectorName} src={`/images/connectors/${connectorName}.png`} alt={connectorName} />
        </TooltipTrigger>
        <TooltipContent>
          <p>{connectorName}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export interface ConnectorImagesProps extends HTMLAttributes<HTMLElement> {}

export const ConnectorImages = ({ className, ...rest }: ConnectorImagesProps) => {
  return (
    <section className={cn('scroll-container', className)} {...rest}>
      <div className="carousel-primary">
        {connectorNamesToShow.map((connectorName) => (
          <ConnectorLogo key={connectorName} connectorName={connectorName} />
        ))}
      </div>
      <div className="carousel-primary carousel-secondary">
        {connectorNamesToShow.map((connectorName) => (
          <ConnectorLogo key={connectorName} connectorName={connectorName} />
        ))}
      </div>
    </section>
  )
}
