import { Automations } from './components/Automations'
import { AutomationWondering } from './components/AutomationWondering'
import { HeroPL } from './components/HeroPL'
import { LastAutomations } from './components/LastAutomations'
import { QuestionsWondering } from './components/Questions'

export default async function IndexPage() {
  return (
    <>
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
    </>
  )
}
