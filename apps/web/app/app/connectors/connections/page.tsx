'use client'

import { AppConnectionWithoutSensitiveData } from '@linkerry/shared'
import { H5 } from '@linkerry/ui-components/server'
import { Row } from '@tanstack/react-table'
import { useCallback } from 'react'
import { useClientQuery } from '../../../../libs/react-query'
import { columns } from '../../../../modules/app-connections/defaultColumns'
import { appConnectionsQueryConfig } from '../../../../modules/app-connections/query-configs-app-connections'
import { ErrorInfo } from '../../../../shared/components/ErrorInfo'
import { DataTable } from '../../../../shared/components/Table/Table'
import { PageContainer } from '../../components/PageContainer'

export default function Page() {
	const { data, error, status } = useClientQuery(appConnectionsQueryConfig.getMany())

	const onClickRowHndler = useCallback(async (row: Row<AppConnectionWithoutSensitiveData>) => {
		// console.debug('onClickRowHndler', row)
		// await push(`/app/flows/editor/${row.original._id}`)
	}, [])

	if (error) return <ErrorInfo errorObject={error} />

	return (
		<PageContainer>
			<H5 className="mb-2 pl-1">Your flows&apos;s</H5>
			<DataTable loading={status === 'pending'} data={data} columns={columns} onClickRow={onClickRowHndler} />
		</PageContainer>
	)
}
