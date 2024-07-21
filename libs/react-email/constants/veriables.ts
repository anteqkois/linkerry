export const colors = {
  primary: 'hsl(262.1 83.3% 57.8%)',
}

export const IS_EMAIL_PREVIEW = process.env?.['DEV_EMAIL'] ?? false
export const frontendUrl = process.env['FRONTEND_HOST']

if (!frontendUrl && !IS_EMAIL_PREVIEW) throw new Error('Missing FRONTEND_HOST env')
