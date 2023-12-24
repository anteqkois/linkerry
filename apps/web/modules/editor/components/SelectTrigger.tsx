import { H5 } from '@market-connector/ui-components/server'
import { HTMLAttributes } from 'react'
import { ConnectorsTable } from '../../connectors-metadata/List/Table'

export interface SelectTriggerProps extends HTMLAttributes<HTMLElement> {}

// export const SelectTrigger = ({}: SelectTriggerProps) => {
export const SelectTrigger = () => {
  // const {} = useEditor()

  return (
    <div>
      <H5 className='pb-3'>Select Trigger</H5>
      <ConnectorsTable collumns={['logoUrl', 'displayName']} />
    </div>
  )
}
