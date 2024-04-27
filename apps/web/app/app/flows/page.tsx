'use client'

import { FlowOperationType, FlowPopulated, FlowStatus, isCustomHttpExceptionAxios, isQuotaErrorCode } from '@linkerry/shared'
import { useToast } from '@linkerry/ui-components/client'
import { H5 } from '@linkerry/ui-components/server'
import { Row } from '@tanstack/react-table'
import { useCallback, useState } from 'react'
import { getBrowserQueryCllient, useClientQuery } from '../../../libs/react-query'
import { useReachLimitDialog } from '../../../modules/billing/useReachLimitDialog'
import { FlowApi } from '../../../modules/flows'
import { columns } from '../../../modules/flows/flows/defaultColumns'
import { flowQueryConfig } from '../../../modules/flows/flows/query-config'
import { ErrorInfo } from '../../../shared/components/ErrorInfo'
import { DataTable } from '../../../shared/components/Table/Table'
import { PageContainer } from '../components/PageContainer'

export default function Page() {
	const { data, error, status } = useClientQuery(flowQueryConfig.getMany({}))
	const { toast } = useToast()
	const { showDialogBasedOnErrorCode } = useReachLimitDialog()
	const [runningOperation, setRunningOperation] = useState(false)

	const onClickRowHndler = useCallback(async (row: Row<FlowPopulated>) => {
		// console.debug('onClickRowHndler', row)
		// await push(`/app/flows/editor/${row.original._id}`)
	}, [])

	const onChangeFlowStatus = useCallback(async (flow: FlowPopulated) => {
		setRunningOperation(true)
		try {
			const newStatus = flow.status === FlowStatus.DISABLED ? FlowStatus.ENABLED : FlowStatus.DISABLED

			await FlowApi.operation(flow._id, {
				type: FlowOperationType.CHANGE_STATUS,
				flowVersionId: flow.version._id,
				request: {
					status: newStatus,
				},
			})

			const queryClient = getBrowserQueryCllient()

			queryClient.setQueryData<FlowPopulated[]>(['flows'], (oldData) => {
				if (!oldData) return undefined

				return [
					...oldData.map((entry) => {
						if (entry._id === flow._id) return { ...entry, status: newStatus }
						else return entry
					}),
				]
			})

			if (newStatus === FlowStatus.ENABLED)
				toast({
					title: 'Flow Enabled',
					description: 'Your Flow is live. We are in Beta version, so please inform our Team if something get wrong.',
					variant: 'success',
				})
			else
				toast({
					title: 'Flow Disabled',
					description: 'Your Flow was stoped. We are in Beta version, so please inform our Team if something get wrong.',
					variant: 'success',
				})
		} catch (error) {
			let errorDescription = 'Unknown error occured, can not update your flow status. Try again and inform our Team.'

			if (isCustomHttpExceptionAxios(error)) {
				if (isQuotaErrorCode(error.response.data.code)) return showDialogBasedOnErrorCode(error.response.data.code)
				else errorDescription = error.response.data.message
			}

			toast({
				title: 'Can not change flow status',
				description: errorDescription,
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
				loading={status === 'pending'}
				data={data}
				columns={columns}
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
