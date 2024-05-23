// import { BaseModelSchema } from '../common/base-model'
// import { ApId } from '../common/id-generator'
// import { Static, Type } from '@sinclair/typebox'

import { z } from 'zod'
import { BaseDatabaseFields } from '../../common'
import { idSchema, stringShortSchema } from '../../common/zod'
import { User, userSchema } from '../user'

export enum NotificationStatus {
  NEVER = 'NEVER',
  ALWAYS = 'ALWAYS',
}

// export enum ProjectType {
//     PLATFORM_MANAGED = 'PLATFORM_MANAGED',
//     STANDALONE = 'STANDALONE',
// }

export const projectSchema = z.object({
  ownerId: idSchema,
  owner: userSchema.optional(),
  userIds: z.array(idSchema),
  users: z.array(userSchema).optional(),
  displayName: stringShortSchema,
  notifyStatus: z.nativeEnum(NotificationStatus),
  // type: ProjectType,
  // platformId: Id,
  // externalId: string,
})

export interface Project extends BaseDatabaseFields, z.infer<typeof projectSchema> {}

export interface ProjectOwnerPopulated extends Omit<Project, 'owner'> {
  owner: User
}
