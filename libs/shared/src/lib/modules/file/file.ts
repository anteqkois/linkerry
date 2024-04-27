import { BaseDatabaseFields, Id } from '../../common'
import { FileCompression } from './file-compression'
import { FileType } from './file-type'

export interface File extends BaseDatabaseFields {
	_id: Id,
	projectId?: string
	// platformId?: string
	type: FileType
	compression: FileCompression
	data: Buffer
}
