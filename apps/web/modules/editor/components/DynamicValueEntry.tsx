import { isNil } from '@linkerry/shared'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@linkerry/ui-components/client'
import { Button, Icons } from '@linkerry/ui-components/server'
import { HTMLAttributes, useState } from 'react'

export interface DynamicValueEntryProps extends HTMLAttributes<HTMLElement> {
	deepLevel: number
	keyName: string
	value: any
}

const deepLevelToPaddingLeft: Record<number, string> = {
	1: 'pl-[15px]',
	2: 'pl-[30px]',
	3: 'pl-[45px]',
	4: 'pl-[60px]',
	5: 'pl-[75px]',
	6: 'pl-[90px]',
	7: 'pl-[105px]',
	8: 'pl-[120px]',
	9: 'pl-[135px]',
	10: 'pl-[150px]',
	11: 'pl-[165px]',
}

export const DynamicValueEntry = ({ keyName, value, deepLevel }: DynamicValueEntryProps) => {
	const [expand, setExpand] = useState(false)

	return (
		<>
			<div
				className={`flex items-center justify-between cursor-pointer hover:bg-accent/50 hover:text-accent-foreground focus:bg-accent/50 focus:text-accent-foreground ${deepLevelToPaddingLeft[deepLevel]}`}
			>
				<HoverCard openDelay={200} closeDelay={100}>
					<HoverCardTrigger asChild>
						<div className="flex items-center p-2 overflow-hidden max-h-8">
							<p className="text-sm text-card-foreground/40 font-medium leading-none pl-2">
								{keyName}
								{typeof value !== 'object' ? (
									<>
										:<span className="text-card-foreground pl-1">{value}</span>
									</>
								) : null}
								{value === null ? (
									<>
										:<span className="text-card-foreground pl-1">null</span>
									</>
								) : null}
							</p>
						</div>
					</HoverCardTrigger>
					<HoverCardContent side="top" align="start" sideOffset={10} className="overflow-scroll w-full max-w-xl max-h-96 p-2">
						<p>{JSON.stringify(value)}</p>
					</HoverCardContent>
				</HoverCard>
				<div className="flex items-center p-0.5 px-2">
					<Button variant={'ghost'} size={'sm'}>
						Insert
					</Button>
					{typeof value === 'object' && !isNil(value) ? (
						<Button size={'icon'} variant={'ghost'} className="ml-1" onClick={() => setExpand((prev) => !prev)}>
							{expand ? <Icons.ArrowDown /> : <Icons.ArrowRight />}
						</Button>
					) : null}
				</div>
			</div>
			{expand && !isNil(value)
				? Object.entries(value).map(([keyName, value], index) => (
						<DynamicValueEntry key={keyName + index} keyName={keyName} value={value} deepLevel={deepLevel + 1} />
				  ))
				: null}
		</>
	)
}
