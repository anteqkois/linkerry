import { Button } from '@linkerry/ui-components/server'
import { HeroImage } from './HeroImage'

export const Hero = () => {
  return (
    <section className="p-2 md:px-10 2xl:pl-52 2xl:pr-10 mx-auto grid grid-cols-12 place-items-center py-20 md:pt-40 gap-y-10">
      <div className="text-center lg:text-start space-y-6 col-span-12 md:col-span-6">
        <main className="text-[2.5rem] leading-tight md:text-5xl 2xl:text-6xl font-bold">
          <h1 className="inline">
            No-Code{' '}
            <span className="inline bg-gradient-to-r from-[hsl(292,83%,70%)] via-[hsl(292,93%,55%)] to-[hsl(292,93%,40%)] text-transparent bg-clip-text">
              Automations
            </span>
            <br />
          </h1>
          <h2 className="inline">
            for{' '}
            <span className="inline bg-gradient-to-r from-[hsl(262,83%,65%)] via-[hsl(262,93%,55%)] to-[hsl(262,93%,50%)] text-transparent bg-clip-text">
              Business
            </span>{' '}
            or{' '}
            <span className="inline bg-gradient-to-r from-[hsl(262,83%,65%)] via-[hsl(262,93%,55%)] to-[hsl(262,93%,50%)] text-transparent bg-clip-text">
              Personal Use
            </span>{' '}
          </h2>
        </main>

        <p className=" text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
          Save time and money with AI-driven automation. We&apos;re focused on simplify all your daily tasks, allowing you to focus on what matters
          most.
        </p>

        <div className="space-y-4 md:space-y-0 md:space-x-4">
          <Button
            className="w-full md:w-1/2 text-xl p-5 font-bold bg-gradient-to-r from-[hsl(262,83%,57%)] via-[hsl(262,93%,55%)] to-[hsl(262,93%,50%)]"
            size={'lg'}
          >
            Start Free
          </Button>
        </div>
      </div>

      <div className="z-10 col-span-12 md:col-span-6 skew-y-1 md:skew-y-3">
        <HeroImage />
        <div
          className="w-4/5 h-4/6 inline-block rotate-1 bg-primary absolute top-[20%] left-[50%] -translate-x-1/2 blur-[120px] -z-10 shadow"
          style={{ animation: 'shadow-slide infinite 4s linear alternate' }}
        />
      </div>
    </section>
  )
}
