export type Id = string // Id to db docuemnt

export interface DatabaseTimestamp {
	createdAt: string
	updatedAt: string
}

export interface BaseDatabaseFields extends DatabaseTimestamp {
	_id: Id
}

export type DatabaseTimestampKeys = keyof BaseDatabaseFields
export type DatabseModelInput<M> = Omit<M, '_id' | DatabaseTimestampKeys>
