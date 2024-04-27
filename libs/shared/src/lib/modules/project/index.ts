// import { BaseModelSchema } from '../common/base-model'
// import { ApId } from '../common/id-generator'
// import { Static, Type } from '@sinclair/typebox'

import { BaseDatabaseFields, Id } from '../../common'
import { User } from '../user'

export enum NotificationStatus {
	NEVER = 'NEVER',
	ALWAYS = 'ALWAYS',
}

// export enum ProjectType {
//     PLATFORM_MANAGED = 'PLATFORM_MANAGED',
//     STANDALONE = 'STANDALONE',
// }

export interface Project extends BaseDatabaseFields {
	_id: Id
	owner: Id
	users: Id[]
	displayName: string
	notifyStatus: NotificationStatus
	// type: ProjectType,
	// platformId: Id,
	// externalId: string,
}

export interface ProjectOwnerPopulated extends Omit<Project, 'owner'> {
	owner: User
}
