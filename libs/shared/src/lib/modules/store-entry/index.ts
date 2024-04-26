import { DatabaseTimestamp, Id } from '../../common'
import { ShortStringType } from '../../common/type-validators'

export interface StoreEntry extends DatabaseTimestamp {
	key: ShortStringType
	projectId: Id
	value: unknown
}

export type PutStoreEntryRequest = {
	key: ShortStringType
	value: any
}

export type GetStoreEntryRequest = {
	key: ShortStringType
}

export type DeletStoreEntryRequest = {
	key: ShortStringType
}
