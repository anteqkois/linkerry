import { IStrategy_GetResponse } from '@market-connector/types'
import { DataTable } from '../../../../components/Table/DataTable'
import { apiServerClient } from '../../../../libs/api-server-client'
import { PageContainer } from '../../components/PageContainer'
import { columns } from './columns'

export default async function Page() {
  const res = await apiServerClient.get<IStrategy_GetResponse>('/strategies')
  
  return (
    <PageContainer>
      <DataTable data={res.data.value} columns={columns}/>
    </PageContainer>
  )
}
