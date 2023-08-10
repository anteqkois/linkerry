import { IUserKeys_GetResponse } from '@market-connector/types'
import { DataTable } from '../../../../components/DataTable'
import { apiServerClient } from '../../../../libs/api-server-client'
import { PageContainer } from '../../components/PageContainer'
import { columns } from './columns'

export default async function Page() {
  const res = await apiServerClient.get<IUserKeys_GetResponse>('/user-keys')

  return (
    <PageContainer>
      <DataTable data={res.data.value} columns={columns}/>
    </PageContainer>
  )
}
