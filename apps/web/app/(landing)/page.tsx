import { Connectors } from './components/Connectors'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { Pricing } from './components/Pricing'

// import { env } from "@/env.mjs"

export default async function IndexPage() {
  return (
    <>
      <Hero />
      <Connectors />
      <Pricing />
      <Footer />
    </>
  )
}
