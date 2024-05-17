import { ConnectorsList } from '../../../modules/flows/connectors/ConnectorsList'
import { PageContainer } from '../../app/components/PageContainer'

export default async function IndexPage() {
  return (
    <PageContainer variant={'fromTop'}>
      <ConnectorsList className="max-h-full overflow-y-scroll" listClassName="max-h-120 overflow-y-scroll md:max-h-160" />
    </PageContainer>
  )
}
