'use client'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@linkerry/ui-components/client'
import { cn } from '@linkerry/ui-components/utils'
import { HTMLAttributes } from 'react'
import { useBodyClass } from '../../../shared/hooks/useBodyClass'
import './connectorLogos.css'

const companyNamesToShow = [
  'active-campaign',
  'airtable',
  'discord',
  'excel',
  'github',
  'google',
  'instagram',
  'jira',
  'linkedIn',
  'mailchimp',
  'microsoft',
  'mysql',
  'notion',
  'openai',
  'sendgrid',
  'shopify',
  'slack',
  'stripe',
  'youtube',
  'zendesk',
]

export interface CompanyLogoProps extends HTMLAttributes<HTMLElement> {
  companyName: string
}

const CompanyLogo = ({ companyName }: CompanyLogoProps) => {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger>
          {/* <Image width={50} height={50} className='bg-slate-50 aspect-square p-1' key={companyName} src={`/images/landing/companies/${companyName}.svg`} alt={companyName} /> */}
          <img className="inline-block h-20 object-contain" src={`/images/landing/companies/${companyName}.svg`} alt={companyName} />
        </TooltipTrigger>
        <TooltipContent>
          <p>{companyName}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export interface CompaniesImagesProps extends HTMLAttributes<HTMLElement> {}

export const CompaniesImages = ({ className, ...rest }: CompaniesImagesProps) => {
  // the connectors image are overlfow X axies, so after mount, add class to body
  useBodyClass('overflow-x-hidden')

  return (
    <section className={cn('scroll-container', className)} {...rest}>
      <div className="carousel-primary bg-purple-200">
        {companyNamesToShow.map((companyName) => (
          <CompanyLogo key={companyName} companyName={companyName} />
        ))}
      </div>
      <div className="carousel-primary carousel-secondary bg-purple-200">
        {companyNamesToShow.map((companyName) => (
          <CompanyLogo key={companyName} companyName={companyName} />
        ))}
      </div>
    </section>
  )
}
