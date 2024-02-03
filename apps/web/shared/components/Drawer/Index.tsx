import { Button, H5, Icons } from '@linkerry/ui-components/server'
import { cn } from '@linkerry/ui-components/utils'
import { cva } from 'class-variance-authority'
import { Dispatch, HTMLAttributes, SetStateAction } from 'react'

export interface DrawerProps extends HTMLAttributes<HTMLElement> {
  show: boolean
  setShow: Dispatch<SetStateAction<boolean>>
  title?: string
}

const variants = cva('w-full h-full fixed top-0 right-0 z-40 bg-popover md:w-108 border-l p-2 ease-out duration-300', {
  variants: {
    state: {
      true: 'translate-x-0',
      false: 'translate-x-full',
    },
  },
  defaultVariants: {
    state: false,
  },
})

export const Drawer = ({ show, setShow, children, title }: DrawerProps) => {
  return (
    <aside className={cn(variants({ state: show }))}>
      <header className="flex justify-between items-center pb-1">
        <H5>{title}</H5>
        <Button size={'sm'} variant={'ghost'} onClick={() => setShow((prev) => !prev)}>
          <Icons.Close />
        </Button>
      </header>
      {children}
    </aside>
  )
}
