import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { useServerQuery } from '../../../libs/react-query'
import { connectorsMetadataQueryConfig } from '../../../modules/flows/connectors/api/query-configs'
import { ConnectorsTable } from '../../../modules/flows/connectors/table/Table'
import { PageContainer } from '../components/PageContainer'

export default async function Page() {
  const { queryClient } = await useServerQuery(connectorsMetadataQueryConfig.getSummaryMany())

  return (
    <PageContainer>
      <HydrationBoundary state={dehydrate(queryClient)}>
          <ConnectorsTable />
      </HydrationBoundary>
    </PageContainer>
  )
}
