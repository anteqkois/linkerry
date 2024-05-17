import { Card } from '@linkerry/ui-components/server'
import { HTMLAttributes } from 'react'
import { ConnectorsList } from '../../../modules/flows/connectors/ConnectorsList'
import { Heading } from './Heading'

export interface ConnectorsProps extends HTMLAttributes<HTMLElement> {}

export const Connectors = () => {
  return (
    <section className="w-full flex-center pb-20 xl:pb-56">
      <div className="flex flex-col relative">
        <Heading className="pb-2">Avaible Connectors</Heading>
        <Card className="p-1 m-2 lg:w-240">
          <ConnectorsList listClassName="bg-background h-100 overflow-y-scroll md:h-100 overflow-scroll" />
        </Card>
        <div
          className="w-4/5 h-2/6 inline-block rotate-1 bg-primary absolute bottom-[15%] left-[40%] -translate-x-1/2 blur-[120px] -z-10 shadow"
          style={{ animation: 'shadow-slide infinite 4s linear alternate' }}
        />
      </div>
    </section>
  )
}
