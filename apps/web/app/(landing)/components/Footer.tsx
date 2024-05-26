import { Icons } from '@linkerry/ui-components/server'

export const Footer = () => {
  return (
    <footer id="footer">
      <hr className="w-11/12 mx-auto" />

      <section className="container py-20 grid grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-x-2 gap-y-2 md:gap-x-12 md:gap-y-8">
        <div className="col-span-full xl:col-span-2">
          <a rel="noreferrer noopener" target="_blank" href="/" className="font-bold text-xl flex gap-2 items-center">
            <Icons.Logo />
            Linkerry
          </a>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg">Follow US</h3>
          {/* <div>
            <a rel="noreferrer noopener" target="_blank" href="https://github.com/anteqkois" className="opacity-60 hover:opacity-100">
              Github
            </a>
          </div> */}

          <div>
            <a rel="noreferrer noopener" target="_blank" href="https://x.com/linkerry_ai" className="opacity-60 hover:opacity-100">
              Twitter
            </a>
          </div>

          {/* <div>
            <a rel="noreferrer noopener" target="_blank" href="#" className="opacity-60 hover:opacity-100">
              Dribbble
            </a>
          </div> */}
        </div>

        {/* <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg">Platforms</h3>
          <div>
            <a rel="noreferrer noopener" target="_blank" href="#" className="opacity-60 hover:opacity-100">
              Web
            </a>
          </div>

          <div>
            <a rel="noreferrer noopener" target="_blank" href="#" className="opacity-60 hover:opacity-100">
              Mobile
            </a>
          </div>

          <div>
            <a rel="noreferrer noopener" target="_blank" href="#" className="opacity-60 hover:opacity-100">
              Desktop
            </a>
          </div>
        </div> */}

        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg">About</h3>
          <div>
            <a rel="noreferrer noopener" href="#connectors" className="opacity-60 hover:opacity-100">
              Connectors
            </a>
          </div>

          <div>
            <a rel="noreferrer noopener" href="#pricing" className="opacity-60 hover:opacity-100">
              Pricing
            </a>
          </div>

          <div>
            <a rel="noreferrer noopener" target="_blank" href="/road-map" className="opacity-60 hover:opacity-100">
              Road Map
            </a>
          </div>

          <div>
            <a
              rel="noreferrer noopener"
              target="_blank"
              href="/docs/linkerry_regulamin_treści_cyfrowe.pdf"
              target="_blank"
              className="opacity-60 hover:opacity-100"
            >
              Terms of Service
            </a>
          </div>

          <div>
            <a rel="noreferrer noopener" target="_blank" href="/docs/linkerry_polityka_prywatności.pdf" className="opacity-60 hover:opacity-100">
              Privacy Policy
            </a>
          </div>

          {/* <div>
            <a rel="noreferrer noopener" target="_blank" href="https://github.com/anteqkois" className="opacity-60 hover:opacity-100">
              CEO
            </a>
          </div> */}

          {/* <div>
            <a rel="noreferrer noopener" target="_blank" href="#" className="opacity-60 hover:opacity-100">
              FAQ
            </a>
          </div> */}
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg">Contact</h3>
          {/* <div>
            <a rel="noreferrer noopener" target="_blank" href="#" className="opacity-60 hover:opacity-100">
              Youtube
            </a>
          </div> */}

          <div>
            <a rel="noreferrer noopener" target="_blank" href="https://discord.gg/Yzs9zbUjd8" className="opacity-60 hover:opacity-100">
              Discord
            </a>
          </div>

          <div>
            <a rel="noreferrer noopener" target="_blank" href="mailto:anteqkois@gmail.com" className="opacity-60 hover:opacity-100">
              E-mail
            </a>
          </div>

          {/* <div>
            <a rel="noreferrer noopener" target="_blank" href="#" className="opacity-60 hover:opacity-100">
              Twitch
            </a>
          </div> */}
        </div>
      </section>

      <section className="container pb-14 text-center">
        <h3>
          &copy; 2024 Linkerry. All rights reserved
          {/* <a
            rel="noreferrer noopener" target="_blank"
            target="_blank"
            href="https://github.com/anteqkois"
            className="text-primary transition-all border-primary hover:border-b-2"
          >
            Anotni Kois
          </a> */}
        </h3>
      </section>
    </footer>
  )
}
