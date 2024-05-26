import { UserProvider } from '../../modules/user/useUser'
import { Connectors } from './components/Connectors'
import { Hero } from './components/Hero'
import { Pricing } from './components/Pricing'

// import { env } from "@/env.mjs"

export default async function IndexPage() {
  return (
    <>
      <Hero />
      <Connectors />
      <UserProvider>
        <Pricing />
      </UserProvider>
    </>
  )
}
