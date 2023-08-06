import { PropsWithChildren } from 'react'

type Props = PropsWithChildren

export const PageContainer = ({ children }: Props) => {
  return (
    <main className="container grid items-center justify-center px-2 pt-14 h-screen w-screen lg:max-w-none lg:px-0">
      {children}
    </main>
  )
}
