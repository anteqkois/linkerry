import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@market-connector/ui-components/server'
import { UserKeysForm } from './UserKeysForm'
import { apiServerClient } from '../../../../libs/api-server-client'
import { IExchangeResponse } from '@market-connector/types'

export async function CardWithForm() {
  const res = await apiServerClient.get<IExchangeResponse>('/exchanges')

  return (
    <Card className="w-full lg:w-144">
      <CardHeader>
        <CardTitle>Add Exchange</CardTitle>
        <CardDescription>When you add exchange, you will be able to use it in conditions.</CardDescription>
      </CardHeader>
      <CardContent>
        <UserKeysForm exchanges={res.data.data.exchanges} />
      </CardContent>
    </Card>
  )
}
