import { BaseDatabaseFields, Id } from '../../common'
import { Project } from '../project'
import { FileCompression } from './file-compression'
import { FileType } from './file-type'

export interface File extends BaseDatabaseFields {
  _id: Id
  projectId: Id
  project?: Project
  // platformId?: string
  type: FileType
  compression: FileCompression
  data: Buffer
}
