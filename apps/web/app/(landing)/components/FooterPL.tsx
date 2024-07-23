import { Icons } from '@linkerry/ui-components/server'

export const FooterPL = () => {
  return (
    <footer id="footer">
      <hr className="w-11/12 mx-auto" />

      <section className="container py-20 grid grid-cols-2 gap-4 md:grid-cols-3 md:pl-40 md:gap-x-12 md:gap-y-8 xl:pl-60">
        <div className="col-span-full md:col-span-1">
          <a rel="noreferrer noopener" target="_blank" href="/" className="font-bold text-xl flex gap-2 items-center">
            <Icons.Logo />
            Linkerry
          </a>
          <a rel="noreferrer noopener" target="_blank" href="https://legal.maxdata.app/company.pdf" className="mt-3 underline underline-offset-3">
            Maxdata App LTD
          </a>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg">Dokumenty</h3>

          <div>
            <a rel="noreferrer noopener" target="_blank" href="/docs/linkerry_regulamin_treści_cyfrowe.pdf" className="opacity-60 hover:opacity-100">
              Regulamin
            </a>
          </div>

          <div>
            <a rel="noreferrer noopener" target="_blank" href="/docs/linkerry_polityka_prywatności.pdf" className="opacity-60 hover:opacity-100">
              Polityka Prywatności
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
          <h3 className="font-bold text-lg">Kontakt</h3>
          <div>
            <a rel="noreferrer noopener" target="_blank" href="mailto:anteqkois@gmail.com" className="opacity-60 hover:opacity-100">
              E-mail
            </a>
          </div>
          <div>
            <a rel="noreferrer noopener" target="_blank" href="mailto:anteqkois@gmail.com" className="opacity-60 hover:opacity-100">
              CEO
            </a>
          </div>
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
