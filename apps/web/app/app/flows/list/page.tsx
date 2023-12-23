import { apiServerClient } from '../../../../libs/api-server-client'
import { DataTable } from '../../../../shared/components/Table/Table'
import { PageContainer } from '../../components/PageContainer'
import { columns } from './columns'

export default async function Page() {
  const res = await apiServerClient.get('/strategies')

  return (
    <PageContainer>
      <DataTable data={res.data.value} columns={columns}/>
    </PageContainer>
  )
}
