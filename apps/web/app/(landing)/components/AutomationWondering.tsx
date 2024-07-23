import { Icons } from '@linkerry/ui-components/server'
import { HTMLAttributes } from 'react'
import { FreeConsultCallToAction } from './FreeConsultCallToAction'
import { Heading } from './Heading'
import { Underscore } from './Underscore'

export interface AutomationWonderingProps extends HTMLAttributes<HTMLElement> {}

const points = [
  'Występują powtarzalne procesy',
  'Macie do czynienia z dużą ilością danych',
  'Brak organizacji procesów, komunikacji i zrozumienia zespołu',
  'Zależy Wam na skalowaniu firmy w maksylanie wydajny sposób',
]

export const AutomationWondering = () => {
  return (
    <section className="w-full flex pb-10 xl:pb-16 md:pt-16 2xl:pt-12" id="automatyzacje">
      <div className="flex flex-col relative">
        <Heading className="pb-10">
          Czy automatyzacja jest dla Ciebie ?
          <Underscore />
        </Heading>
        <div className="text-2xl mt-4">W niemal 100% jeśli:</div>
        <ul>
          {points.map((e) => (
            <li key={e} className="flex items-start gap-2 text-sm md:text-xl mt-4">
              <Icons.Power className="text-primary/90 pt-1" size={'md'} />
              <span dangerouslySetInnerHTML={{ __html: e }} />
            </li>
          ))}
        </ul>
        <div
          className="w-4/5 h-4/6 inline-block rotate-1 bg-primary/20 absolute bottom-[10%] left-[40%] -translate-x-1/2 blur-[120px] -z-10 shadow"
          style={{ animation: 'shadow-slide infinite 4s linear alternate' }}
        />
        <div className="text-1xl mt-12">
          Nadal tego nie czuejesz ? Skontaktuj się z nami na bezpłatną konsultację na której rozwiążemy twoje problemy.
        </div>
        <div className="mt-4">
          <FreeConsultCallToAction />
        </div>
      </div>
    </section>
  )
}
