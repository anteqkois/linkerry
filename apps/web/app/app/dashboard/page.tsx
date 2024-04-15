import { Button, H5 } from '@linkerry/ui-components/server'
import { PageContainer } from '../components/PageContainer'
import { ChartStatistic } from './components/ChartStatistic'
import { EmailVerification } from './components/EmailVerification'
import { FlowsInfo } from './components/FlowsInfo'
import { SubscriptionInfo } from './components/SubscriptionInfo'
import { TodayFlowRunsInfo } from './components/TodayFlowRunsInfo'

export default function Page() {
	return (
		<PageContainer>
			<div className="sm:flex justify-between mb-3 items-center flex-wrap">
				<H5 className="mb-2 pl-1">Dashboard</H5>
				<div className="flex gap-2 flex-grow sm:flex-grow-0">
					<Button className="flex-grow" variant={'secondary'}>
						Connectors
					</Button>
					<Button className="flex-grow" variant={'secondary'}>
						Flows
					</Button>
					<Button className="flex-grow">Create new FLow</Button>
				</div>
			</div>
			{/* <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
				<Button>Create new FLow</Button>
			</div> */}
			<div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 mb-3">
				<SubscriptionInfo />
				<FlowsInfo />
				<TodayFlowRunsInfo />
			</div>
			<ChartStatistic />
			<EmailVerification />
		</PageContainer>
	)
}
