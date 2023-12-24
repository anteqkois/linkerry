import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { ConnectorsTable } from '../../../modules/connectors-metadata/Table/Table'
import { useConnectorMetadataServerQuery } from '../../../modules/connectors-metadata/useConnectorsMetadataQuery'
import { PageContainer } from '../components/PageContainer'

export default async function Page() {
  const { queryClient } = await useConnectorMetadataServerQuery()

  return (
    <PageContainer>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="w-full max-w-7xl">
          <ConnectorsTable />
        </div>
      </HydrationBoundary>
    </PageContainer>
  )
}
