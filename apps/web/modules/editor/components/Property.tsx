import { Label } from '@linkerry/ui-components/client'
import { Icons, Muted } from '@linkerry/ui-components/server'
import { cn } from '@linkerry/ui-components/utils'
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
          <Icons.True className="h-5 w-5 text-positive -mr-1" />
        ) : (
          <Icons.False className="h-5 w-5 text-destructive -mr-1" />
        )
      ) : children ? (
        children
      ) : (
        <Muted>{value}</Muted>
      )}
    </Label>
  )
}
