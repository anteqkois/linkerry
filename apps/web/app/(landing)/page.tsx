import { UserProvider } from '../../modules/user/useUser'
import { ConnectorImages } from './components/ConnectorLogos'
import { Connectors } from './components/Connectors'
import { Hero } from './components/Hero'
import { Pricing } from './components/Pricing'

// import { env } from "@/env.mjs"

export default async function IndexPage() {
  return (
    <>
      <Hero />
      <ConnectorImages className='hidden md:block'/>
      <Connectors />
      <UserProvider>
        <Pricing />
      </UserProvider>
    </>
  )
}
