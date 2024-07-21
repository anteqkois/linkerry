import { Icons } from '@linkerry/ui-components/server'
import { HTMLAttributes } from 'react'
import { Heading } from './Heading'
import { Underscore } from './Underscore'

export interface LastAutomationsProps extends HTMLAttributes<HTMLElement> {}

const lastAutomations = [
  'Automatyczne tworzenie i wysyłanie faktur po zakupie produktów',
  'Sortowanie, oznaczanie e-maili oraz automatyczne powiadomienia</br> w przypadku e-maili wymagających szybkiej reakcji, a także automatyczne odpowiedzi',
  'Przekazywanie jednej informacji na wiele komunikatorów jednocześnie,</br> takich jak Telegram, Discord, e-mail',
  'Tworzenie spersonalizowanych ofert',
  'Automatyczne powiadomienia w przypadku zbliżania się do braku produktów w magazynie</br> oraz automatyczne zamawianie tych produktów',
]

export const LastAutomations = () => {
  return (
    <section className="w-full flex justify-end pr-[15%] pb-10 xl:pb-32 md:pt-20 2xl:pt-24" id="automatyzacje">
      <div className="flex flex-col relative">
        <Heading className="pb-10">
          Nasze ostatnie autoamtyzacje
          <Underscore />
        </Heading>
        <ul>
          {lastAutomations.map((e) => (
            <li key={e} className="flex items-start gap-2 text-xl mt-4">
              <Icons.Power className="text-primary/90 pt-1" size={'md'} />
              <span dangerouslySetInnerHTML={{ __html: e }} />
            </li>
          ))}
        </ul>
        <div
          className="w-4/5 h-4/6 inline-block rotate-1 bg-primary/40 absolute bottom-[10%] left-[60%] -translate-x-1/2 blur-[120px] -z-10 shadow"
          style={{ animation: 'shadow-slide infinite 4s linear alternate' }}
        />
      </div>
    </section>
  )
}
