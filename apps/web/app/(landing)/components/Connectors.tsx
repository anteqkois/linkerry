import { Card } from '@linkerry/ui-components/server'
import { HTMLAttributes } from 'react'
import { ConnectorsList } from '../../../modules/flows/connectors/ConnectorsList'
import { Heading } from './Heading'

export interface ConnectorsProps extends HTMLAttributes<HTMLElement> {}

export const Connectors = () => {
  return (
    <section className="w-full flex-center pb-10 xl:pb-32 md:pt-20 2xl:pt-56" id="connectors">
      <div className="flex flex-col relative">
        <Heading className="pb-2">Avaible Connectors</Heading>
        <Card className="p-1 m-2 lg:w-240">
          <ConnectorsList listClassName="bg-background h-100 overflow-y-scroll md:h-120 overflow-scroll" />
        </Card>
        <Heading className="text-center text-1xl lg:text-2xl font-semibold transition-colorstext-center text-muted-foreground">
          {/* More soon, focused on Web3 and AI apps */}
          More connectors soon
        </Heading>
        <div
          className="w-4/5 h-2/6 inline-block rotate-1 bg-primary absolute bottom-[15%] left-[40%] -translate-x-1/2 blur-[120px] -z-10 shadow"
          style={{ animation: 'shadow-slide infinite 4s linear alternate' }}
        />
      </div>
    </section>
  )
}
