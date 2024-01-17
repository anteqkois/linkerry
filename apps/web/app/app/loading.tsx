import { Icons } from '@linkerry/ui-components/server'

export default function Loading() {
  return (
    <div className="grid items-center justify-center h-screen w-screen">
      <Icons.Spinner className="w-10 h-10" />
    </div>
  )
}
