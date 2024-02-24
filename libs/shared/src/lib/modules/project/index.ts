// import { BaseModelSchema } from '../common/base-model'
// import { ApId } from '../common/id-generator'
// import { Static, Type } from '@sinclair/typebox'

import { Id, TimestampDatabase } from '../../common'

export enum NotificationStatus {
	NEVER = 'NEVER',
	ALWAYS = 'ALWAYS',
}

// export enum ProjectType {
//     PLATFORM_MANAGED = 'PLATFORM_MANAGED',
//     STANDALONE = 'STANDALONE',
// }

export interface Project extends TimestampDatabase {
	ownerId: Id
	users: Id[]
	displayName: string
	notifyStatus: NotificationStatus
	// type: ProjectType,
	// platformId: Id,
	// externalId: string,
}
