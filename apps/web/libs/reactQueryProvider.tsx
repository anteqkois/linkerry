'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { getBrowserQueryCllient } from './react-query'

interface Props {
  children: React.ReactNode
}

export default function ReactQueryProvider({ children }: Props) {
  const [queryClient] = useState(() => getBrowserQueryCllient())

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
