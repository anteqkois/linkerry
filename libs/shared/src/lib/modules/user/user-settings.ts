import { BaseDatabaseFields, Id } from '../../common'
import { User } from './user'

export interface UserSettings extends BaseDatabaseFields {
  userId: Id
  user: User
}
