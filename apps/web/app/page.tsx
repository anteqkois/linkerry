import {
  Button,
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
  ModeToggle,
} from '@market-connector/ui-components'

export default async function Index() {
  return (
    <div>
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Alerts</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              New Tab <MenubarShortcut>⌘T</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>New Window</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Share</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Print</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Strategies</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              New Tab <MenubarShortcut>⌘T</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>New Window</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Share</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Print</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <ModeToggle />
        </MenubarMenu>
      </Menubar>
      <Button>Test</Button>
      <Button variant="secondary">Test</Button>
      <Button variant="destructive">Test</Button>
      <Button variant="ghost">Test</Button>
      <Button variant="outline">Test</Button>
      <Button variant="link">Test</Button>
    </div>
  )
}
