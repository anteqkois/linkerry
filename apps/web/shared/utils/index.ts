import { isCustomHttpException } from '@linkerry/shared'
import { isAxiosError } from 'axios'

export const absoluteUrl = (path: string) => {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`
}

export const retriveServerHttpException = (error: unknown) => {
  if (isAxiosError(error) && isCustomHttpException(error.response?.data)) return error.response?.data
  return undefined
}
