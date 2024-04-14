export const colors = {
	primary: 'hsl(262.1 83.3% 57.8%)',
}

export const frontendUrl = process.env.FRONTEND_HOST
if (!frontendUrl) throw new Error('Missing FRONTEND_HOST env')

export const IS_EMAIL_PREVIEW = process.env?.DEV_EMAIL ?? false
