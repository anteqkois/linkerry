import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { Heading } from '../../(landing)/components/Heading'
import { useServerQuery } from '../../../libs/react-query'
import { ConnectorsList } from '../../../modules/flows/connectors/ConnectorsList'
import { connectorsMetadataQueryConfig } from '../../../modules/flows/connectors/api/query-configs'
import { PageContainer } from '../components/PageContainer'

export default async function Page() {
  const { queryClient } = await useServerQuery(connectorsMetadataQueryConfig.getSummaryMany())

  return (
    <PageContainer variant={'centered'}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="max-w-4xl relative">
          <Heading className="pb-2">Avaible Connectors</Heading>
          <ConnectorsList listClassName="bg-background h-100 overflow-y-scroll md:h-120 overflow-scroll" />
          <div
            className="w-full h-2/6 inline-block rotate-1 bg-primary absolute bottom-[15%] left-[42%] -translate-x-1/2 blur-[120px] -z-10 shadow"
            style={{ animation: 'shadow-slide infinite 4s linear alternate' }}
          />
        </div>
      </HydrationBoundary>
    </PageContainer>
  )
}
