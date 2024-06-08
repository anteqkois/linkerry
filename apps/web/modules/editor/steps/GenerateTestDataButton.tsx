import { ButtonClient, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@linkerry/ui-components/client'
import { Icons } from '@linkerry/ui-components/server'
import { HTMLAttributes } from 'react'

export interface GenerateTestDataButtonProps extends HTMLAttributes<HTMLButtonElement> {
  disabled: boolean
  disabledMessage: string
  text: string
  loading: boolean
  haveSampleData?: boolean
  onSelectSampleData?: () => void
}

export const GenerateTestDataButton = ({
  disabled,
  disabledMessage,
  text,
  loading,
  haveSampleData,
  onSelectSampleData,
  onClick,
}: GenerateTestDataButtonProps) => {
  return (
    <div className="flex gap-2">
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger disabled={!disabled} asChild>
            <ButtonClient loading={loading} variant="secondary" onClick={onClick} disabled={disabled} size={'sm'}>
              <Icons.Test size={'xs'} className="mr-3 animate-pulse" />
              <span className="whitespace-nowrap">{text}</span>
            </ButtonClient>
          </TooltipTrigger>
          <TooltipContent>
            <p>{disabled ? disabledMessage : 'Test this trigger to generate sample data that can be used in the next steps'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {haveSampleData ? (
        <>
          <span>or</span>
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger disabled={!disabled} asChild>
                <ButtonClient
                  loading={loading}
                  variant="secondary"
                  onClick={onSelectSampleData}
                  disabled={disabled}
                  size={'sm'}
                  className="whitespace-nowrap"
                >
                  Use Mock Data
                </ButtonClient>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {disabled
                    ? disabledMessage
                    : 'You can use predefined sample data. In most case data schema is the same, but values can be different.'}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </>
      ) : null}
    </div>
  )
}
