import { PageContainer } from '../../app/components/PageContainer'
import { Automations } from '../components/Automations'

export default async function IndexPage() {
  return (
    <PageContainer variant={'fromTop'}>
      <Automations />
    </PageContainer>
  )
}
