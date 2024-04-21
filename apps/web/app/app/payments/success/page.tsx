import { Button, H2, Icons } from '@linkerry/ui-components/server'
import Link from 'next/link'
import { PageContainer } from '../../components/PageContainer'

export default function Page() {
	return (
		<PageContainer variant={'centered'} className="flex-col space-y-4">
			<Icons.BadgeCheck className="h-24 w-24 text-positive lg:h-40 lg:w-40" />
			<div className="flex-center flex-col">
				<H2 className='lg:text-6xl lg:mb-3'>Payment successful</H2>
				<p>Thank you for choosing Linkerry 💜</p>
				<p>- linkerry Team</p>
			</div>
			<Link href="/app/dashboard">
				<Button variant={'outline'}>To Dashboard</Button>
			</Link>
		</PageContainer>
	)
}
