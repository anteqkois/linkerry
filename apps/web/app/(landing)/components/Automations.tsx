import { Icons } from '@linkerry/ui-components/server'
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
  'Obsługe klienta',
  'Marketing i sprzedaż',
  'Administracja',
  'Zarządzanie danymi',
  'Statystyki, raporty, zamówienia',
  'Przekazywanie danych',
  'Rektrutacje i HR',
  'Oraz wiele więcej...',
]

export const Automations = () => {
  return (
    <section className="w-full flex pl-[15%] pb-10 xl:pb-32 md:pt-20 2xl:pt-36" id="automatyzacje">
      <div className="flex flex-col relative">
        <Heading className="pb-10">
          Możesz zautomatyzować
          <Underscore />
        </Heading>
        <ul>
          {automations.map((e) => (
            <li key={e} className="flex items-start gap-2 text-xl mt-4">
              <Icons.Power className="text-primary/90 pt-1" size={'md'} />
              <span dangerouslySetInnerHTML={{ __html: e }} />
            </li>
          ))}
        </ul>
        <div
          className="w-4/5 h-4/6 inline-block rotate-1 bg-primary/40 absolute bottom-[10%] left-[40%] -translate-x-1/2 blur-[120px] -z-10 shadow"
          style={{ animation: 'shadow-slide infinite 4s linear alternate' }}
        />
      </div>
    </section>
  )
}
