import { MoonIcon, SunIcon } from '@radix-ui/react-icons'
import { useTheme } from 'next-themes'

import { Button } from '../ui/button'

export function ModeToggle() {
  const { setTheme } = useTheme()

  // const setNewTheme = useCallback(() => {
  //   setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'))
  // }, [])

  return (
    <Button variant="outline" size="icon" className="h-9 w-9">
      <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" onClick={() => setTheme('dark')} />
      <MoonIcon
        className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
        onClick={() => setTheme('light')}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
  // return (
  //   <DropdownMenu>
  //     <DropdownMenuTrigger asChild>
  //       <Button variant="outline" size="icon" className="h-9 w-9">
  //         <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
  //         <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
  //         <span className="sr-only">Toggle theme</span>
  //       </Button>
  //     </DropdownMenuTrigger>
  //     <DropdownMenuContent align="end">
  //       <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
  //       <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
  //       <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
  //     </DropdownMenuContent>
  //   </DropdownMenu>
  // )
}
