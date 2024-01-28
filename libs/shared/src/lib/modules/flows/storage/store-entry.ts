import { Id, TimestampDatabase } from '../../../common'

export type StoreEntryId = Id

export type StoreEntry = {
	key: string
	// projectId: ProjectId
	value: unknown
} & TimestampDatabase

export type PutStoreEntryRequest = {
	key: string
	value: any
}

export type GetStoreEntryRequest = {
	key: string
}

export type DeletStoreEntryRequest = {
	key: string
}
