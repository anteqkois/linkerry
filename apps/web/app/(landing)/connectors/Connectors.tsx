'use client'

import { ConnectorMetadataSummary, ConnectorTag, connectorTag } from '@linkerry/connectors-framework'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@linkerry/ui-components/client'
import { Badge, Button, Icons } from '@linkerry/ui-components/server'
import { cn } from '@linkerry/ui-components/utils'
import { useDebouncedEffect } from '@react-hookz/web'
import { HTMLAttributes, useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useClientQuery } from '../../../libs/react-query'
import { ConnectorReviewItem } from '../../../modules/flows/connectors/ConnectorReviewItem'
import { connectorsMetadataQueryConfig } from '../../../modules/flows/connectors/api/query-configs'

const tagOptions = connectorTag.map((tag) => ({
  label: tag,
  value: tag,
}))

export interface ConnectorReviewItemProps extends HTMLAttributes<HTMLElement> {
  onClickConnector: (connector: ConnectorMetadataSummary) => void
  connectorType?: 'trigger' | 'action'
}

export const Connectors = ({ onClickConnector, connectorType }: ConnectorReviewItemProps) => {
  const { data } = useClientQuery(connectorsMetadataQueryConfig.getSummaryMany())
  const [filteredConnectors, setFilteredConnectors] = useState<ConnectorMetadataSummary[]>([])
  const [connectorsForType, setConnectorsForType] = useState<ConnectorMetadataSummary[]>([])
  const [search, setSearch] = useState('')
  const [tags, setTags] = useState<ConnectorTag[]>([])

  useEffect(() => {
    if (!data) return
    if (!connectorType) return setConnectorsForType(data)
    if (connectorType === 'action') return setConnectorsForType(data.filter((connectorMetadata) => connectorMetadata.actions))
    else if (connectorType === 'trigger') return setConnectorsForType(data.filter((connectorMetadata) => connectorMetadata.triggers))
  }, [data])

  useEffect(() => {
    if (connectorsForType?.length) setFilteredConnectors(connectorsForType)
  }, [connectorsForType])

  useDebouncedEffect(
    () => {
      if (!connectorsForType.length) return
      if (!search) setFilteredConnectors(connectorsForType)
      const vector = search.toLocaleLowerCase()
      setFilteredConnectors(
        connectorsForType.filter((connector) => {
          return connector.displayName.toLocaleLowerCase().includes(vector)
        }),
      )
    },
    [search],
    500,
  )

  useDebouncedEffect(
    () => {
      if (!connectorsForType.length) return
      if (!tags.length) return setFilteredConnectors(connectorsForType)
      setFilteredConnectors(
        connectorsForType.filter((connector) => {
          return tags.some((tag) => connector.tags.includes(tag))
        }),
      )
    },
    [tags],
    500,
  )

  const next = async () => {
    // setLoading(true)
    // setHasMore(false)
    // const res = await fetch(`https://dummyjson.com/products?limit=3&skip=${3 * page}&select=title,price`)
    // const data = (await res.json()) as DummyProductResponse
    // setProducts((prev) => [...prev, ...data.products])
    // setPage((prev) => prev + 1)
    // // Usually your response will tell you if there is no more data.
    // if (data.products.length < 3) {
    //   setHasMore(false)
    // }
    // setLoading(false)
  }

  const onAddTag = (newTag: ConnectorTag) => {
    setTags((currentTags) => {
      return [...currentTags, newTag]
    })
  }

  const onRemoveTag = (newTag: ConnectorTag) => {
    setTags((currentTags) => {
      return currentTags.filter((tag) => tag !== newTag)
    })
  }

  return (
    <div className="p-1 w-full flex justify-center">
      <div className="flex w-full flex-wrap max-w-2xl overflow-scroll">
        <div className="bg-background/95 w-full p-4 flex flex-wrap gap-2 items-center backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <form className="flex-grow">
            <div className="relative">
              <Icons.Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search"
                className="pl-8"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value)
                }}
              />
            </div>
          </form>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 border-dashed">
                <Icons.Plus />
                <span className="px-2">Tags</span>
                <span className="min-w-[18px]">
                  <Badge variant="secondary" className="rounded-sm pl-1 pr-1 font-normal">
                    {tags.length}
                  </Badge>
                </span>
                {/* <span className="min-w-[30px]">
                  {tags?.length > 0 && (
                    <Badge variant="secondary" className="rounded-sm font-normal">
                      {tags.length}
                    </Badge>
                  )}
                </span> */}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] p-0" align="start">
              <Command>
                <CommandInput placeholder="search tags" />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup className="mb-10">
                    {tagOptions.map((option) => {
                      const isSelected = tags.includes(option.value)
                      return (
                        <CommandItem
                          key={option.value}
                          onSelect={() => {
                            if (isSelected) {
                              onRemoveTag(option.value)
                            } else {
                              onAddTag(option.value)
                            }
                          }}
                          className="cursor-pointer"
                        >
                          <div
                            className={cn(
                              'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                              isSelected ? 'bg-primary text-primary-foreground' : 'opacity-50',
                            )}
                          >
                            {isSelected && <Icons.Check className={cn('h-4 w-4')} />}
                          </div>
                          {/* {option.icon && <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />} */}
                          <span>{option.label}</span>
                          {/* {facets?.get(option.value) && (
                            <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">{facets.get(option.value)}</span>
                          )} */}
                        </CommandItem>
                      )
                    })}
                  </CommandGroup>
                  {tags.length > 0 && (
                    <>
                      <CommandSeparator />
                      <CommandGroup className="absolute bottom-0 left-0 right-0 bg-background">
                        <CommandItem onSelect={() => setTags([])} className="justify-center text-cente cursor-pointer">
                          Clear filters
                        </CommandItem>
                      </CommandGroup>
                    </>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <InfiniteScroll dataLength={filteredConnectors.length} next={next} hasMore={false} loader={<Icons.Spinner />}>
          {!filteredConnectors.length ? (
            <p className="pl-5 text-muted-foreground">No connectors found ...</p>
          ) : (
            filteredConnectors.map((connector) => (
              <div key={connector._id}>
                <ConnectorReviewItem connector={connector} onClickConnector={onClickConnector} />
              </div>
            ))
          )}
        </InfiniteScroll>
      </div>
    </div>
  )
}
