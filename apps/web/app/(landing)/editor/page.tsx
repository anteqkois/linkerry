import { PageContainer } from '../../app/components/PageContainer'
import { HeroImage } from '../components/HeroImage'

export default async function IndexPage() {
  return (
    <PageContainer variant={'fromTop'} className="p-10">
      <HeroImage />
    </PageContainer>
  )
}
