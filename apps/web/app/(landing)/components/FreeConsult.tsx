'use client'

import { buttonVariants } from '@linkerry/ui-components/client'
import { cn } from '@linkerry/ui-components/utils'
import Link from 'next/link'

export function NavFreeConsult() {
  return (
    <Link href="/bezpłatna-konsultacja" className={cn(buttonVariants({ size: 'lg' }), 'px-4 uppercase font-black')}>
      Bezpłatna konsultacja
    </Link>
  )
}
