import { HTMLAttributes } from 'react'

export interface ErrorInfoProps extends HTMLAttributes<HTMLElement> {
  message: string
}

export const ErrorInfo = ({ message }: ErrorInfoProps) => {
  return <div>{message}</div>
}
