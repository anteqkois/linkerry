import { DatabaseTimestamp, Id } from '../../common'
import { ShortStringType } from '../../common/type-validators'
import { User } from '../user'

export enum NotificationStatus {
	NEVER = 'NEVER',
	ALWAYS = 'ALWAYS',
}

// export enum ProjectType {
//     PLATFORM_MANAGED = 'PLATFORM_MANAGED',
//     STANDALONE = 'STANDALONE',
// }

export interface Project extends DatabaseTimestamp {
	_id: Id
	owner: Id
	users: Id[]
	displayName: ShortStringType
	notifyStatus: NotificationStatus
	// type: ProjectType,
	// platformId: Id,
	// externalId: string,
}

export interface ProjectOwnerPopulated extends Omit<Project, 'owner'> {
	owner: User
}
