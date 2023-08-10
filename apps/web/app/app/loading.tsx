import { Icons } from '@market-connector/ui-components/server'

export default function Loading() {
  return (
    <div className="grid items-center justify-center h-screen w-screen">
      <Icons.spinner className="w-10 h-10" />
    </div>
  )
}
