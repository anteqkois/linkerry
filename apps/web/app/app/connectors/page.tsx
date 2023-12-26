import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { useServerQuery } from '../../../libs/react-query'
import { connectorsMetadataQueryConfig } from '../../../modules/connectors-metadata/api/query-configs'
import { ConnectorsTable } from '../../../modules/connectors-metadata/table/Table'
import { PageContainer } from '../components/PageContainer'

export default async function Page() {
  const { queryClient } = await useServerQuery(connectorsMetadataQueryConfig.getSummaryMany())

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
