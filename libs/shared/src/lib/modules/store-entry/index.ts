import { Id, TimestampDatabase } from '../../common'

export interface StoreEntry extends TimestampDatabase {
	key: string
	projectId: Id
	value: unknown
}

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
