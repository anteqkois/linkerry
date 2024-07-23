import { Icons } from '@linkerry/ui-components/server'
import { HTMLAttributes } from 'react'
import { FreeConsultCallToAction } from './FreeConsultCallToAction'
import { Heading } from './Heading'
import { Underscore } from './Underscore'

export interface QuestionsWonderingProps extends HTMLAttributes<HTMLElement> {}

const pointsOne = ['zrozumienia środowiska i potrzeb', 'szczegółowej analizy procesów biznesowych', 'wdrożenia i testowania automatyzacji']
const pointsTwo = [
  'Zacznij małymi krokami i dodawaj automatyzacji stopniowo krok po kroku',
  'Zacznij od stworzenia procesów pozwalających zautomatyzować twoją działaność w maksymalny sposób od podstaw',
]

export const QuestionsWondering = () => {
  return (
    <section className="w-full flex-center pb-10 xl:pb-32 md:pt-20 2xl:pt-24" id="automatyzacje">
      <div className="flex flex-col relative">
        <Heading className="pb-10">
          Najczęstsze pytania ?
          <Underscore />
        </Heading>
        <div className="text-2xl my-4 font-bold">W jaki sposób działa automatyzacja?</div>
        <div className="max-w-[700px]">
          Polega na wprowadzeniu systemów, które wyręczają pracowników w wykonywaniu rutynowych i powtarzalnych zadań oraz ręcznej pracy z danymi.
          Przykłady zastosowań to tworzenie spersonalizowanych ofert, generowanie raportów, przekazywanie wiadomości na wiele kanałów, odpowaidanie na
          wiadmości i wychwytwaynie tych najistoniejszych, przygotowywanie umów, wystawianie i księgowanie faktur, a także zarządzanie firmowymi
          płatnościami.
        </div>

        <div className="text-2xl mt-14 mb-4 font-bold">Czas wdrożenie ?</div>
        <div className="max-w-[700px]">
          <div className="pb-2">Proces wdrożenia automatyzacji składa się z trzech głównych etapów:</div>
          <ul>
            {pointsOne.map((e) => (
              <li key={e} className="flex items-start gap-1 mt-1">
                <Icons.Power className="text-primary/90 pt-1 h-6" />
                <span dangerouslySetInnerHTML={{ __html: e }} />
              </li>
            ))}
          </ul>
          <div className="pt-3">
            Czas realizacji zależy od wielkości firmy, złożoności procesów oraz ich liczby. Istnieje także możliwość podzielenie ostatniego etapu na
            mnijesze, zaczynając od najabrdziej istotnych autoamtyzacji
          </div>
        </div>

        <div className="text-2xl mt-14 mb-4 font-bold">Koszt?</div>
        <div className="max-w-[700px]">
          <div className="pb-2">
            Automatyzacja może być postrzegana jako inwestycja, która zwraca czas twoich pracowników i pozwala się im skupić na tym co istotne oraz co
            da im więcej satysfakcji z pracy. Koszty wdrożenia i utrzymania są elastyczne i zazwyczaj rozliczane w modelu abonamentowym. Miesięczne
            koszty utrzymania zaczynają się od 300 zł wzwyż i zależą od zakresu oraz złożoności współpracy. Dajemy także wybór między wdrażaniem jednej z dwóch
            opcji:
          </div>
          <ul>
            {pointsTwo.map((e) => (
              <li key={e} className="flex items-start gap-1 mt-1">
                <Icons.Power className="text-primary/90 pt-1 h-6" />
                <span dangerouslySetInnerHTML={{ __html: e }} />
              </li>
            ))}
          </ul>
        </div>
        <div
          className="w-4/5 h-4/6 inline-block rotate-1 bg-primary/20 absolute bottom-[10%] left-[60%] -translate-x-1/2 blur-[120px] -z-10 shadow"
          style={{ animation: 'shadow-slide infinite 4s linear alternate' }}
        />
        <div className="mt-16">
          <FreeConsultCallToAction />
        </div>
      </div>
    </section>
  )
}
