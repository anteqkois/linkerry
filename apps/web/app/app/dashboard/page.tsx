import { Button, H5 } from '@linkerry/ui-components/server'
import Link from 'next/link'
import { PageContainer } from '../components/PageContainer'
import { ChartStatistic } from './components/ChartStatistic'
import { EmailVerification } from './components/EmailVerification'
import { FlowsInfo } from './components/FlowsInfo'
import { SubscriptionInfo } from './components/SubscriptionInfo'
import { TasksInfo } from './components/TasksInfo'
import { WeekFlowRunsInfo } from './components/WeekFlowRunsInfo'

export default function Page() {
  return (
    <PageContainer maxScreen={true}>
      <div className="flex flex-col min-h-screen-no-nav">
        <div className="sm:flex justify-between mb-3 items-center flex-wrap">
          <H5 className="mb-2 pl-1">Dashboard</H5>
          <div className="flex gap-2 flex-grow sm:flex-grow-0">
            <Link href="/app/connectors">
              <Button className="flex-grow" variant={'outline'}>
                Connectors
              </Button>
            </Link>
            <Link href="/app/flows">
              <Button className="flex-grow" variant={'outline'}>
                Flows
              </Button>
            </Link>
            <Link href="/app/flows/editor">
              <Button className="flex-grow">Create new FLow</Button>
            </Link>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 mb-3">
          <SubscriptionInfo />
          <FlowsInfo />
          <TasksInfo />
          <WeekFlowRunsInfo />
        </div>
        <ChartStatistic className="flex-grow h-96 min-h-full" />
        <EmailVerification />
      </div>
    </PageContainer>
  )
}
