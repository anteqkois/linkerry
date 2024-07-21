import { FreeConsultCallToAction } from './FreeConsultCallToAction'
import { HeroImage } from './HeroImage'
import { Underscore } from './Underscore'

export const HeroPL = () => {
  return (
    <section className="p-2 md:px-10 2xl:pl-52 2xl:pr-10 mx-auto grid grid-cols-12 place-items-center py-20 md:pt-40 gap-y-10">
      <div className="text-center lg:text-start col-span-12 md:col-span-8">
        <main className="text-[2.5rem] md:text-7xl font-bold">
          <h1 className="inline">
            <span className="inline-block leading-[1.15] bg-gradient-to-r from-[hsl(292,83%,70%)] via-[hsl(292,93%,55%)] to-[hsl(292,93%,40%)] text-transparent bg-clip-text">
              Lokalizujemy
              <Underscore />
            </span>
            <br />
            <span className="inline-block leading-[1.15] ml-14 bg-gradient-to-r from-[hsl(262,83%,65%)] via-[hsl(262,93%,55%)] to-[hsl(262,93%,50%)] text-transparent bg-clip-text">
              Projektujemy
              <Underscore />
            </span>
            <br />
            <span className="inline-block leading-[1.15] ml-28 bg-gradient-to-r from-[hsl(292,83%,70%)] via-[hsl(292,93%,55%)] to-[hsl(292,93%,40%)] text-transparent bg-clip-text">
              Automatyzujemy
              <Underscore />
            </span>
            <br />
          </h1>
          {/* <h1 className="inline">
            <span className="inline leading-[1.15] bg-gradient-to-r from-[hsl(292,83%,70%)] via-[hsl(292,93%,55%)] to-[hsl(292,93%,40%)] text-transparent bg-clip-text">
              Lokalizujemy
            </span>
            <span className="text-muted-foreground text-[2.5rem] md:text-5xl 2xl:text-7xl">,</span>
            <br />
            <span className="inline leading-[1.15] ml-14 bg-gradient-to-r from-[hsl(262,83%,65%)] via-[hsl(262,93%,55%)] to-[hsl(262,93%,50%)] text-transparent bg-clip-text">
              Projektujemy
            </span>
            <span className="text-muted-foreground text-[2.5rem] md:text-5xl 2xl:text-7xl">,</span>
            <br />
            <span className="ml-28 text-muted-foreground text-[2.5rem] md:text-5xl 2xl:text-7xl">i </span>
            <span className="inline leading-[1.15] bg-gradient-to-r from-[hsl(292,83%,70%)] via-[hsl(292,93%,55%)] to-[hsl(292,93%,40%)] text-transparent bg-clip-text">
              Automatyzujemy
            </span>
            <br />
          </h1> */}
        </main>

        <p className="text-base mt-16 md:w-9/12 mx-auto lg:mx-0 lg:mt-32 lg:w-8/12">
          Zyskaj więcej czasu oraz zwiększ skalę działania dzięki przekazaniu powtarzających się działań do autopilota. Zacznij małymi krokami, bądź
          od stworzenia procesów pozwalających zautomatyzować twoją działaność w maksymalny sposób.
        </p>

        <div className="mt-5 ">
          <FreeConsultCallToAction />
        </div>
      </div>

      <div className="z-10 col-span-12 md:col-span-4 skew-y-1 md:skew-y-3">
        <HeroImage />
        <div
          className="w-4/5 h-4/6 inline-block rotate-1 bg-primary absolute top-[25%] left-[55%] -translate-x-1/2 blur-[80px] -z-10 shadow"
          style={{ animation: 'shadow-slide infinite 4s linear alternate' }}
        />
      </div>
    </section>
  )
}
