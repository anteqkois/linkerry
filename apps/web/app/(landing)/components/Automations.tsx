import { Card, CardDescription, CardTitle, Icons } from '@linkerry/ui-components/server'
import { HTMLAttributes } from 'react'
import { Heading } from './Heading'
import { Underscore } from './Underscore'

export interface AutomationsProps extends HTMLAttributes<HTMLElement> {}

// strong {
//   position: relative;

//   &::after {
//     content: '';
//     position: absolute;
//     bottom: -0.125rem;
//     left: -0.5rem;
//     right: -0.5rem;
//     height: 0.75rem;

//     // Position the line behind the text so that
//     // it is still easily readable
//     z-index: -1;

//     // The SVG is added as an SVG background image
//     background-image: url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/664131/underline.svg');
//     background-repeat: no-repeat;

//     // This allows the SVG to flex in size to fit
//     // any length of word. If the word is short,
//     // the SVG will be stretched vertically, if it
//     // is long, the SVG will be stretched horizontally.
//     // The jagged nature of this particular SVG works
//     // with this transforming.
//     background-size: cover;
//   }
// }

// p > strong {
//   font-weight: 400;

//   &::after {
//     // Specific positioning for smaller text
//     bottom: -0.2rem;
//     height: 0.5rem;
//     left: -0.25rem;
//     right: -0.25rem;
//   }
// }

// // ---------------------------------
// // Other properties for the demo, not related to
// // the underlined text

// body {
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   min-height: 100vh;
// }

// h1, p {
//   font-family: "dosis", sans-serif;
//   max-width: 800px;
//   margin: 0 5% 1rem;
// }

// h1 {
//   font-size: 2.5rem;
//   font-weight: 600;
// }

// p {
//   font-size: 1.125rem;
// }

const automations = [
  {
    title: 'Obsługe klienta',
    description:
      'Zautomatyzujemy procesy związane z obsługą klienta, takie jak odpowiadanie na zapytania, zarządzanie zgłoszeniami i monitorowanie satysfakcji klientów. Dzięki automatyzacji skrócisz czas reakcji i poprawisz jakość obsługi.',
  },
  {
    title: 'Marketing i sprzedaż',
    description:
      'Automatyzacja kampanii marketingowych i procesów sprzedażowych pozwoli Ci skuteczniej docierać do klientów, personalizować komunikację oraz śledzić efektywność działań. Zwiększ sprzedaż i zaangażowanie klientów dzięki inteligentnym narzędziom.',
  },
  {
    title: 'Administracja',
    description:
      'Uprościmy zarządzanie codziennymi zadaniami administracyjnymi, takimi jak fakturowanie, korespondencja i zarządzanie dokumentami. Automatyzacja tych procesów pozwoli zaoszczędzić czas i zredukować ryzyko błędów.',
  },
  {
    title: 'Zarządzanie danymi',
    description:
      'Zautomatyzujemy gromadzenie, przetwarzanie i analizę danych, co pozwoli Ci podejmować lepsze decyzje biznesowe. Dzięki automatyzacji będziesz mieć zawsze aktualne i dokładne informacje na wyciągnięcie ręki.',
  },
  {
    title: 'Statystyki, raporty, zamówienia',
    description:
      'Automatyzacja generowania raportów i analiz statystycznych ułatwi śledzenie kluczowych wskaźników wydajności. Zarządzanie zamówieniami stanie się prostsze i bardziej efektywne dzięki automatycznym powiadomieniom i aktualizacjom.',
  },
  {
    title: 'Przekazywanie danych',
    description:
      'Umożliwimy automatyczne przekazywanie danych pomiędzy różnymi systemami i platformami, eliminując potrzebę ręcznego wprowadzania informacji. To rozwiązanie zapewni spójność i integralność danych w Twojej organizacji.',
  },
  {
    title: 'Rektrutacje i HR',
    description:
      'Automatyzacja procesów rekrutacyjnych i zarządzania zasobami ludzkimi przyspieszy wyszukiwanie kandydatów, monitorowanie aplikacji i zarządzanie dokumentacją pracowniczą. Dzięki temu Twoja firma będzie mogła szybciej reagować na potrzeby kadrowe.',
  },
  {
    title: 'Oraz wiele więcej...',
    description:
      'Nasze rozwiązania automatyzacyjne obejmują wiele innych obszarów działalności. Skontaktuj się z nami, aby dowiedzieć się, jak możemy zoptymalizować Twoje unikalne procesy i wyzwania biznesowe.',
  },
]

export const Automations = () => {
  return (
    <section className="w-full flex pb-10 xl:pb-16 md:pt-10 2xl:pt-20" id="automatyzacje">
      <div className="flex flex-col relative">
        <Heading className="pb-10">
          {/* Możemy dla Ciebie zautomatyzować */}
          Zautomatyzujemy dla Ciebie
          <Underscore />
        </Heading>
        <div className="grid grid-cols-12 gap-4">
          {automations.map((e) => (
            <Card key={e.title} className="col-span-6 md:col-span-3">
              <CardTitle className='px-4 pt-5'>
                <p className="flex items-start text-primary-text font-bold gap-2 text-xl lg:text-2xl">
                  <Icons.Power className="pt-1" size={'md'} />
                  <span dangerouslySetInnerHTML={{ __html: e.title }} />
                </p>
              </CardTitle>
              <CardDescription className='text-sm md:text-base p-5 text-background-page'>{e.description}</CardDescription>
            </Card>
          ))}
        </div>
        <div
          className="w-full h-4/6 inline-block rotate-1 bg-primary/30 absolute bottom-[10%] left-[45%] -translate-x-1/2 blur-[120px] -z-10 shadow"
          style={{ animation: 'shadow-slide infinite 4s linear alternate' }}
        />
      </div>
    </section>
  )
}
