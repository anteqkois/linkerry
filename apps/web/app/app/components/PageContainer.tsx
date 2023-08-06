import { PropsWithChildren, ReactPropTypes } from 'react'

type Props = PropsWithChildren

export const PageContainer = ({ children }: Props) => {
  return (
    <main className="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:px-0">
      {children}
    </main>
  )
}
