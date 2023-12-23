import { ConnectorsTable } from '../../../modules/connectors-metadata/List/Table'
import { ConnectorsMetadataApi } from '../../../modules/connectors-metadata/api'
import { PageContainer } from '../components/PageContainer'

export default async function Page() {
  const res = await ConnectorsMetadataApi.get()

  return (
    <PageContainer>
      <ConnectorsTable data={res.data} />
    </PageContainer>
  )
}
