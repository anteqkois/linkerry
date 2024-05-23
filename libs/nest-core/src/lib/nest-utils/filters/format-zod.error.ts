import { ZodIssue } from 'zod'

export const formatZodIssue = (issue: ZodIssue) => {
  let message: string
  switch (issue.code) {
    case 'invalid_type':
      message = `${issue.message}. Expect ${issue.expected}, received ${issue.received}`
      break
    case 'invalid_string':
      message = `${issue.message} field '${issue.path.join('.')}'`
      break
    case 'invalid_union':
      message = `${issue.message} union. ${issue.unionErrors
        .map((unionIssue) => `${unionIssue.issues[0].path.join('.')} ${unionIssue.issues[0].message}`)
        .join(' OR ')}`
      // message = `${issue.message} union. ${issue.unionErrors.map((unionIssue) => formatZodIssue(unionIssue.issues[0])).join(' OR ')}`
      break
    default:
      message = issue.message
      break
  }
  return {
    message,
    path: issue.path.join('.'),
  }
}
