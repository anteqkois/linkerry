import { PageContainer } from '../../app/components/PageContainer'
import { RoadMap } from '../components/RoadMap'

export default async function IndexPage() {
  return (
    <PageContainer variant={'fromTop'} className='overflow-x-hidden'>
      <RoadMap />
    </PageContainer>
  )
}
