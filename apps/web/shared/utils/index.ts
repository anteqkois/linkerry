import { isCustomHttpException } from '@linkerry/shared'
import { isAxiosError } from 'axios'
import { MouseEvent } from 'react'

export const absoluteUrl = (path: string) => {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`
}

export const retriveServerHttpException = (error: unknown) => {
  if (isAxiosError(error) && isCustomHttpException(error.response?.data)) return error.response?.data
  return undefined
}

// Utility function to stop event propagation
export const withStopPropagation = (handler: (...args: any[]) => any | void) => (e: MouseEvent) => {
  e.stopPropagation()
  handler(e)
}

export const stopPropagation = (e: MouseEvent) => {
  e.stopPropagation()
}
