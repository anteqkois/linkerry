import { Button, Icons } from '@market-connector/ui-components/server'
import { cn } from '@market-connector/ui-components/utils'
import { cva } from 'class-variance-authority'
import { HTMLAttributes } from 'react'

export interface DrawerProps extends HTMLAttributes<HTMLElement> {
  show: boolean
  setShow: (val: boolean) => void
}

const variants = cva('w-full h-full fixed top-0 right-0 z-40 bg-popover lg:w-108 border-l p-2 ease-out duration-300 pt-6', {
  variants: {
    // variant: {
    //   // default: 'scroll-m-20 text-xl font-semibold tracking-tight',
    // },
    state: {
      true: 'translate-x-0',
      false: 'translate-x-108',
    },
  },
  defaultVariants: {
    // variant: 'default',
  },
})

export const Drawer = ({ show, setShow, children }: DrawerProps) => {
  return (
    <aside className={cn(variants({ state: show }))}>
      <Button size={'sm'} variant={'ghost'} className="fixed top-1 right-1" onClick={() => setShow(false)}>
        <Icons.close />
      </Button>
      {children}
    </aside>
  )
}
