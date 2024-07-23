import { Icons } from '@linkerry/ui-components/server'
import { HTMLAttributes } from 'react'
import { Heading } from './Heading'
import { Underscore } from './Underscore'

export interface LastAutomationsProps extends HTMLAttributes<HTMLElement> {}

const lastAutomations = [
  'Tworzenie i wysyłanie faktur <strong class="text-primary-text">(oszczędność ~8h/msc.)</strong>',
  'Sortowanie, oznaczanie i automatyczne odpowiadanie na e-maile oraz</br>dodatkowe powiadomienia dla e-maili wymagających</br>szybkiej reakcji człowieka <strong class="text-primary-text">(oszczędność ~18h/msc.)</strong>',
  'Przekazywanie informacji na wiele komunikatorów jednocześnie, takich jak Telegram,</br>Discord, e-mail <strong class="text-primary-text">(oszczędność~3h/msc.)</strong>',
  'Tworzenie spersonalizowanych ofert <strong class="text-primary-text">(oszczędność ~34h/msc.)</strong>',
  'Powiadomienia o niskim stanie magazynowym i automatyczne</br>zamawianie brakujących produktów <strong class="text-primary-text">(oszczędność ~12h/msc.)</strong>',
]

export const LastAutomations = () => {
  return (
    <section className="w-full flex justify-end pr-[5%] pb-5 xl:pb-16 md:pt-10 2xl:pt-16" id="automatyzacje-w-praktyce">
      <div className="flex flex-col relative">
        <Heading className="pb-10">
          Nasze ostatnie automatyzacje
          <Underscore />
        </Heading>
        <ul>
          {lastAutomations.map((e) => (
            <li key={e} className="flex items-start gap-2 text-sm md:text-xl mt-4">
              <Icons.Power className="text-primary/90 pt-1" size={'md'} />
              <span dangerouslySetInnerHTML={{ __html: e }} />
            </li>
          ))}
        </ul>
        <div
          className="w-4/5 h-4/6 inline-block rotate-1 bg-primary/20 absolute bottom-[10%] left-[60%] -translate-x-1/2 blur-[120px] -z-10 shadow"
          style={{ animation: 'shadow-slide infinite 4s linear alternate' }}
        />
      </div>
    </section>
  )
}
