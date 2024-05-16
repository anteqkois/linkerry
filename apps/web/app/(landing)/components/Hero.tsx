// import { Button } from "./ui/button";
// import { buttonVariants } from "./ui/button";
// import { HeroCards } from "./HeroCards";
// import { GitHubLogoIcon } from "@radix-ui/react-icons";

import { Button } from '@linkerry/ui-components/server'
import { MacOSWindow } from './MacOSWindow'

export const Hero = () => {
  return (
    <section className="container grid lg:grid-cols-6 place-items-center py-20 md:py-52 gap-10">
      <div className="text-center lg:text-start space-y-6 col-span-6 md:col-span-4">
        <main className="text-5xl md:text-6xl font-bold">
          <h1 className="inline">
            No-Code{' '}
            {/* <span className="inline bg-gradient-to-r from-[hsl(262,83%,65%)] via-[hsl(262,93%,55%)] to-[hsl(262,93%,50%)] text-transparent bg-clip-text"> */}
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

        <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
          Save time and money with AI-driven automation. We&apos;re focused on simplify all your daily tasks, allowing you to focus on what matters
          most.
        </p>

        <div className="space-y-4 md:space-y-0 md:space-x-4">
          <Button className="w-full md:w-1/3 text-xl p-5 font-bold" size={'lg'}>
            Start Free
          </Button>
        </div>
      </div>

      {/* Hero cards sections */}
      <div className="z-10">
        <MacOSWindow>Hello</MacOSWindow>
      </div>
      {/* <div className="z-10"><HeroCards /></div> */}

      {/* Shadow effect */}
      {/* <div className="shadow"></div> */}
    </section>
  )
}
