import { CompaniesHeroImage } from './CompaniesHeroImage'
import { FreeConsultCallToAction } from './FreeConsultCallToAction'
import { Underscore } from './Underscore'

export const HeroPL = () => {
  return (
    <section className="mx-auto pt-24 grid grid-cols-12 place-items-center pb-20 md:pt-40 gap-y-5">
      <div className=" col-span-12 md:pt-10 lg:text-start lg:col-span-8">
        <main className="text-[2.5rem] md:text-6xl 2xl:text-7xl font-bold">
          <h1 className="inline">
            <span className="inline-block leading-[1.15] bg-gradient-to-r from-[hsl(292,83%,70%)] via-[hsl(292,93%,55%)] to-[hsl(292,93%,40%)] text-transparent bg-clip-text">
              Lokalizujemy
              <Underscore />
            </span>
            <br />
            <span className="inline-block leading-[1.15] ml-5 md:ml-14 bg-gradient-to-r from-[hsl(262,83%,65%)] via-[hsl(262,93%,55%)] to-[hsl(262,93%,50%)] text-transparent bg-clip-text">
              Projektujemy
              <Underscore />
            </span>
            <br />
            <span className="inline-block leading-[1.15] ml-10 md:ml-28 bg-gradient-to-r from-[hsl(292,83%,70%)] via-[hsl(292,93%,55%)] to-[hsl(292,93%,40%)] text-transparent bg-clip-text">
              Automatyzujemy
              <Underscore />
            </span>
            <br />
          </h1>
        </main>

        <p className="text-sm mt-10 mx-auto md:w-10/12 lg:mx-0 lg:mt-20 lg:w-10/12 2xl:mt-28 2xl:w-10/12 2xl:text-2xl">
          Zyskaj więcej czasu oraz zwiększ skalę działania dzięki przekazaniu powtarzających się działań do autopilota. Zacznij małymi krokami, bądź
          od stworzenia procesów pozwalających zautomatyzować twoją działaność w maksymalny sposób.
        </p>

        <div className="mt-5 ">
          <FreeConsultCallToAction />
        </div>
      </div>

      <div className="z-10 col-span-12 lg:col-span-4">
        <div className="skew-y-1 md:skew-y-3">
          <CompaniesHeroImage />
          {/* <div
            className="w-4/5 h-4/6 inline-block rotate-1 bg-primary/30 absolute top-[25%] left-[55%] -translate-x-1/2 blur-[80px] -z-10 shadow"
            style={{ animation: 'shadow-slide infinite 4s linear alternate' }}
          /> */}
        </div>
        <div className='text-center pt-4 font-semibold text-muted-foreground'>Dostęp do każdej aplikacji</div>
      </div>
      {/* <CompaniesImages className='hidden md:block'/> */}
    </section>
  )
}
