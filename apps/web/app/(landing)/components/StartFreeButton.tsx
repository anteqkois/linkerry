'use client'

import { buttonVariants } from '@linkerry/ui-components/server'
import { cn } from '@linkerry/ui-components/utils'
import Link from 'next/link'

export const StartFreeButton = () => {
  return (
    <Link
      href="/signup"
      className={cn(
        buttonVariants({ size: 'lg' }),
        'w-full md:w-1/2 text-xl p-5 font-bold bg-gradient-to-r from-[hsl(262,83%,57%)] via-[hsl(262,93%,55%)] to-[hsl(262,93%,50%)]',
      )}
    >
      Start Free
    </Link>
  )
}
