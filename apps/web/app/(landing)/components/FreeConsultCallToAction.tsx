'use client'

import { buttonVariants } from '@linkerry/ui-components/server'
import { cn } from '@linkerry/ui-components/utils'
import Link from 'next/link'

export const FreeConsultCallToAction = () => {
  return (
    <Link
      href="/bezpłatna-konsultacja"
      className={cn(
        buttonVariants({ size: 'lg' }),
        'w-full md:w-1/2 text-xl uppercase font-bold p-5 bg-gradient-to-r from-[hsl(262,83%,57%)] via-[hsl(262,93%,55%)] to-[hsl(262,93%,50%)]',
      )}
    >
      Bezpłatna konsultacja
    </Link>
  )
}
