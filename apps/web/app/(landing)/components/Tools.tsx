import { Icons } from '@linkerry/ui-components/server'
import { HTMLAttributes } from 'react'
import { Heading } from './Heading'
import { Underscore } from './Underscore'


// Dzięki naszemu systemowi możemy zautomatyzować procesy z każdym istniejącym narzędziem, wykorzystując jego API – warstwę komunikacji. Excel, fakturowanie, bramki płatności, bazy danych, Asana, Jira, Slack to tylko ułamek z dostępnych opcji. Oferujemy także połączenie z wewnętrznymi aplikacjami, dla których nasz zespół przygotuje minimalistyczne oprogramowanie do połączenia, działające jak rozszerzenie przeglądarki.

export const Tools = () => {
  return (
    <section className="w-full flex pl-[15%] pb-10 xl:pb-32 md:pt-20 2xl:pt-36" id="automatyzacje">
      <div className="flex flex-col relative">
        <Heading className="pb-10">
        Wspierane narzędzia
          <Underscore />
        </Heading>
        {/* <ul>
          {automations.map((e) => (
            <li key={e} className="flex items-start gap-2 text-xl mt-4">
              <Icons.Power className="text-primary/90 pt-1" size={'md'} />
              <span dangerouslySetInnerHTML={{ __html: e }} />
            </li>
          ))}
        </ul> */}
        <div
          className="w-4/5 h-4/6 inline-block rotate-1 bg-primary/40 absolute bottom-[10%] left-[40%] -translate-x-1/2 blur-[120px] -z-10 shadow"
          style={{ animation: 'shadow-slide infinite 4s linear alternate' }}
        />
      </div>
    </section>
  )
}
