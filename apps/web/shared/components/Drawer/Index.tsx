import { Button, H5, Icons } from '@linkerry/ui-components/server'
import { cn } from '@linkerry/ui-components/utils'
import { cva } from 'class-variance-authority'
import { Dispatch, HTMLAttributes, SetStateAction } from 'react'

const variants = cva('w-full h-[calc(100%-56px)] fixed top-14 z-40 bg-popover max-h-full md:w-108 border-l border-r ease-out duration-300', {
  variants: {
    state: {
      true: 'translate-x-0',
      false: '',
    },
    position: {
      left: 'left-0',
      right: 'right-0',
    },
  },
  defaultVariants: {
    state: false,
  },
  compoundVariants: [
    {
      position: 'right',
      state: false,
      className: 'translate-x-full',
    },
    {
      position: 'left',
      state: false,
      className: '-translate-x-full',
    },
  ],
})

export interface DrawerProps extends HTMLAttributes<HTMLElement> {
  show: boolean
  setShow: Dispatch<SetStateAction<boolean>>
  title?: string
  position: 'left' | 'right'
  customHeader?: JSX.Element
}

export const Drawer = ({ show, setShow, children, title, position, className, customHeader }: DrawerProps) => {
  return (
    <aside className={cn(variants({ state: show, position }), className)}>
      {customHeader ? (
        customHeader
      ) : (
        <header className="p-2">
          <H5>{title}</H5>
        </header>
      )}
      <Button className="absolute top-2 right-2" size={'icon'} variant={'ghost'} onClick={() => setShow((prev) => !prev)}>
        <Icons.Close size={'xs'} />
      </Button>
      <div className="h-[calc(100%-44px)]">{children}</div>
    </aside>
  )
}
