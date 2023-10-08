import { Button, Icons } from '@market-connector/ui-components/server'
import { cn } from '@market-connector/ui-components/utils'
import { cva } from 'class-variance-authority'

export interface DrawerProps {
  show: boolean
  setShow: (val: boolean) => void
}

const variants = cva('w-full h-full fixed top-0 right-0 z-40 bg-popover lg:w-108 border-l p-2 ease-out duration-300', {
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

export const Drawer = ({ show, setShow }: DrawerProps) => {

  return (
    <aside className={cn(variants({ state: show }))}>
      <Button size={'sm'} variant={'ghost'} className="fixed top-1 right-1" onClick={() => setShow(false)}>
        <Icons.close />
      </Button>
      {/* <Card>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iusto dolores placeat soluta sint quae nam natus cumque officia facere ullam
        adipisci, nisi voluptatem! Eos et sequi ex quasi quam rerum?
      </Card> */}
    </aside>
  )
}
