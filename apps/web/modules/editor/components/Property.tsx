import { Label } from '@market-connector/ui-components/client'
import { Icons, Muted } from '@market-connector/ui-components/server'

export interface PropertyProps {
  label: string
  value?: string | number | boolean
}

export const Property = ({ label, value }: PropertyProps) => {
  return (
    <Label className="flex items-center justify-between px-2 h-10 border-b-[1px] border-muted/90 last-of-type:border-none">
      <span>{label}:</span>
      {typeof value === 'boolean' ? (
        value ? (
          <Icons.true className="h-5 w-5 text-positive -mr-1" />
        ) : (
          <Icons.false className="h-5 w-5 text-destructive -mr-1" />
        )
      ) : (
        <Muted>{value}</Muted>
      )}
    </Label>
  )
}
