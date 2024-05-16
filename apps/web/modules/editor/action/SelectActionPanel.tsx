import { ConnectorMetadataSummary } from '@linkerry/connectors-framework'
import { isCustomHttpExceptionAxios, isQuotaErrorCode } from '@linkerry/shared'
import { Separator, useToast } from '@linkerry/ui-components/client'
import { Icons } from '@linkerry/ui-components/server'
import { Row } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useClientQuery } from '../../../libs/react-query'
import { useReachLimitDialog } from '../../billing/useReachLimitDialog'
import { ConnectorReviewItem } from '../../flows/connectors/ConnectorReviewItem'
import { connectorsMetadataQueryConfig } from '../../flows/connectors/api/query-configs'
import { useEditor } from '../useEditor'

export const SelectActionPanel = () => {
  const { data } = useClientQuery(connectorsMetadataQueryConfig.getSummaryMany())
  const { showDialogBasedOnErrorCode } = useReachLimitDialog()
  const { handleSelectActionConnector } = useEditor()
  const { toast } = useToast()

  const connectorsWithActions = useMemo(() => {
    if (!data?.length) return []
    return data.filter((connectorMetadata) => connectorMetadata.actions)
  }, [data])

  const next = async () => {
    setLoading(true)

    setHasMore(false)
    // const res = await fetch(`https://dummyjson.com/products?limit=3&skip=${3 * page}&select=title,price`)
    // const data = (await res.json()) as DummyProductResponse
    // setProducts((prev) => [...prev, ...data.products])
    // setPage((prev) => prev + 1)

    // // Usually your response will tell you if there is no more data.
    // if (data.products.length < 3) {
    //   setHasMore(false)
    // }
    setLoading(false)
  }

  const handleSelectAction = async (row: Row<ConnectorMetadataSummary>) => {
    try {
      await handleSelectActionConnector(row.original)
    } catch (error) {
      let errorDescription = 'We can not add new step to your flow. Please inform our Team'

      if (isCustomHttpExceptionAxios(error)) {
        if (isQuotaErrorCode(error.response.data.code)) return showDialogBasedOnErrorCode(error.response.data.code)
        else errorDescription = error.response.data.message
      }

      toast({
        title: 'Can not update Flow',
        description: errorDescription,
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="p-1">
      <div className="flex w-full overflow-scroll">
        <InfiniteScroll dataLength={connectorsWithActions.length} next={next} hasMore={false} loader={<Icons.Spinner />}>
          {connectorsWithActions.map((connector) => (
            <div key={connector._id}>
              <ConnectorReviewItem connector={connector} />
              <Separator className='my-5'/>
            </div>
          ))}
        </InfiniteScroll>

        {/* <InfiniteScroll hasMore={hasMore} isLoading={loading} next={next} threshold={1}> */}
        {/* {hasMore && <Icons.Spinner />} */}
        {/* {hasMore && <Spinner />}
        </InfiniteScroll> */}
      </div>
      {/* <DataTable
        getRowId={(row) => row._id}
        onClickRow={handleSelectAction}
        data={connectorsWithActions}
        columns={columns}
        filterAccessor="displayName"
        chooseFilters={[
          {
            accessor: 'tags',
            title: 'Tags',
            options: connectorTag.map((tag) => ({
              label: tag,
              value: tag,
            })),
          },
        ]}
        className="overflow-y-scroll max-h-100"
        onlyColumns={['logoUrl', 'displayName', 'description']}
        clickable
      /> */}
    </div>
  )
}
