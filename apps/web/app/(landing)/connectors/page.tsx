import { PageContainer } from '../../app/components/PageContainer'
import { Connectors } from '../components/Connectors'

export default async function IndexPage() {
  return (
    <PageContainer variant={'fromTop'}>
      <Connectors />
    </PageContainer>
  )
}
