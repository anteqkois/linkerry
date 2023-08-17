import { Label } from '@market-connector/ui-components/client'
import { Icons, Muted } from '@market-connector/ui-components/server'
import { cn } from '@market-connector/ui-components/utils'
import { ReactNode } from 'react'

export interface PropertyProps {
  label: string
  value?: string | number | boolean
  children?: ReactNode
  clasaName?: string
}

export const Property = ({ label, value, children, clasaName }: PropertyProps) => {
  return (
    <Label className={cn('flex items-center justify-between px-2 h-10 border-b-[1px] border-muted/90 last-of-type:border-none', clasaName)}>
      <span>{label}:</span>
      {typeof value === 'boolean' ? (
        value ? (
          <Icons.true className="h-5 w-5 text-positive -mr-1" />
        ) : (
          <Icons.false className="h-5 w-5 text-destructive -mr-1" />
        )
      ) : children ? (
        children
      ) : (
        <Muted>{value}</Muted>
      )}
    </Label>
  )
}
