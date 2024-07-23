import { Automations } from './components/Automations'
import { AutomationWondering } from './components/AutomationWondering'
import { HeroPL } from './components/HeroPL'
import { LastAutomations } from './components/LastAutomations'
import { QuestionsWondering } from './components/Questions'

export default async function IndexPage() {
  return (
    <main className='px-3 xl:max-w-[85%] 2xl:max-w-[1400px] mx-auto'>
      <HeroPL />
      <Automations />
      <LastAutomations />
      <AutomationWondering />
      <QuestionsWondering />
      {/* <ConnectorImages className='hidden md:block'/>
      <Connectors />
      <UserProvider>
        <Pricing />
      </UserProvider> */}
    </main>
  )
}
