import { PageContainer } from '../../components/PageContainer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@market-connector/ui-components/server'
import { UserKeysForm } from './UserKeysForm'
import { apiServerClient } from '../../../../libs/api-server-client'
import { IExchange_GetResponse } from '@market-connector/types'

export default async function Page() {
  const res = await apiServerClient.get<IExchange_GetResponse>('/exchanges')

  return (
    <PageContainer>
      <Card className="w-full lg:w-144">
        <CardHeader>
          <CardTitle>Add API Keys</CardTitle>
          <CardDescription>When you add exchange's API keys, you will be able to use them to execute your strategies.</CardDescription>
        </CardHeader>
        <CardContent>
          <UserKeysForm exchanges={res.data.value} />
        </CardContent>
      </Card>
    </PageContainer>
  )
}
