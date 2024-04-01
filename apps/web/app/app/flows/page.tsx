'use client'

import { FlowOperationType, FlowPopulated, FlowStatus, isCustomHttpExceptionAxios } from '@linkerry/shared'
import {
	useToast
} from '@linkerry/ui-components/client'
import { H5 } from '@linkerry/ui-components/server'
import { Row } from '@tanstack/react-table'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { useClientQuery } from '../../../libs/react-query'
import { FlowApi } from '../../../modules/flows'
import { columns } from '../../../modules/flows/flows/defaultColumns'
import { flowQueryConfig } from '../../../modules/flows/flows/query-config'
import { ErrorInfo } from '../../../shared/components/ErrorInfo'
import { DataTable } from '../../../shared/components/Table/Table'
import { PageContainer } from '../components/PageContainer'

export default function Page() {
	const { data, error } = useClientQuery(flowQueryConfig.getMany({}))
	const { toast } = useToast()
	const { push } = useRouter()
	const [runningOperation, setRunningOperation] = useState(false)

	const onClickRowHndler = useCallback(async (row: Row<FlowPopulated>) => {
		console.log('onClickRowHndler', row)
		// await push(`/app/flows/editor/${row.original._id}`)
	}, [])

	const onChangeFlowStatus = useCallback(async (flow: FlowPopulated) => {
		setRunningOperation(true)
		try {
			switch (flow.status) {
				case FlowStatus.DISABLED:
					await FlowApi.operation(flow._id, {
						type: FlowOperationType.CHANGE_STATUS,
						flowVersionId: flow.version._id,
						request: {
							status: FlowStatus.ENABLED,
						},
					})
					toast({
						title: 'Flow Enabled',
						description: 'Your Flow is live. We are in Beta version, so please inform our Team if something get wrong.',
						variant: 'success',
					})
					break
				case FlowStatus.ENABLED:
					await FlowApi.operation(flow._id, {
						type: FlowOperationType.CHANGE_STATUS,
						flowVersionId: flow.version._id,
						request: {
							status: FlowStatus.DISABLED,
						},
					})
					toast({
						title: 'Flow Disabled',
						description: 'Your Flow was stoped. We are in Beta version, so please inform our Team if something get wrong.',
						variant: 'success',
					})
					break
			}
		} catch (error) {
			let message = 'Unknown error occured, can not update your flow status. Try again and inform our Team.'

			if (isCustomHttpExceptionAxios(error)) message = error.response.data.message

			toast({
				title: message,
				variant: 'destructive',
			})
		} finally {
			setRunningOperation(false)
		}
	}, [])

	if (error) return <ErrorInfo errorObject={error} />

	return (
		<PageContainer>
			<H5 className="mb-2 pl-1">Your flows&apos;s</H5>
			<DataTable
				data={data}
				columns={columns}
				clickable
				onClickRow={onClickRowHndler}
				meta={{ onChangeFlowStatus, runningOperation }}
				// filterAccessor="displayName"
				// chooseFilters={[
				// 	{
				// 		accessor: 'tags',
				// 		title: 'Tags',
				// 		options: connectorTag.map((tag) => ({
				// 			label: tag,
				// 			value: tag,
				// 		})),
				// 	},
				// ]}
				// mobileColumns={mobileCollumns || defaultMobileColumns}
				// desktopColumns={desktopCollumns}
				// onlyColumns={onlyColumns || []}
			/>
		</PageContainer>
	)
}
