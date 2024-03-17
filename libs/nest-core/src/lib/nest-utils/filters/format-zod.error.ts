import { ZodIssue } from "zod"

export const formatZodIssue = (issue: ZodIssue) => {
	let message: string
	switch (issue.code) {
		case 'invalid_type':
			message = `${issue.message}. Expect ${issue.expected}, received ${issue.received}`
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
