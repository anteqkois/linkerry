import { Id, TimestampDatabase } from '../../../common'

export type StoreEntry = {
	key: string
	projectId: Id
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
