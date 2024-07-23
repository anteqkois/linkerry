import { Body, Container, Head, Html, Preview, Section } from '@react-email/components'
import React from 'react'
import { Footer } from '../components/Footer'
import { IS_EMAIL_PREVIEW } from '../constants/veriables'
import { box, container, main } from '../styles'

interface Props {
  companyName: string
  // firstName: string
}
const defaaultProps: Props = {
  companyName: 'MY COMPANY',
  // firstName: string
}

export const VerificationEmail = (props: Props) => {
  const { companyName } = IS_EMAIL_PREVIEW ? defaaultProps : props

  return (
    <Html>
      <Head />
      <Preview>Oszczędność czasu, pieniędzy i szybki rozwój</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            <p>Dzień dobry,</p>
            <p>
              Czy w {companyName} macie <strong>problem z efektywnością i czasem poświęcanym na powtarzalne procesy</strong>, takie jak:
            </p>
            <ul>
              <li>Obsługa klienta</li>
              <li>Marketing i sprzedaż</li>
              <li>Administracja</li>
              <li>Zarządzanie danymi</li>
              <li>Statystyki, raporty, zamówienia</li>
              <li>Przekazywanie danych</li>
              <li>Rekrutacja i HR</li>
            </ul>
            <p>
              Bądź przed szybkim rozwojem <strong>zablokowała Was potrzeba</strong> natychmiastowej rekrutacji nowych osób?
            </p>
            <p>
              <strong>Rozwiązaniem jest automatyzacja</strong> procesów, która <strong>raz wdrożona działa już zawsze i niezależne</strong>,
              pozwalając pracownikom zająć się bardziej kreatywnymi i satysfakcjonującymi zadaniami. <br />
              Nasz softwarehouse specjalizuje się w projektowaniu i wdrożeniu automatyzacji procesów biznesowych i codziennych działań.
            </p>

            <p>Ostatnie automatyzacje u klientów to między innymi:</p>
            <ul>
              <li>Tworzenie i wysyłanie faktur po zakupie produktów (oszczędność ~8h/msc.)</li>
              <li>
              Sortowanie, oznaczanie i automatyczne odpowiadanie na e-maile oraz dodatkowe powiadomienia dla e-maili wymagających szybkiej reakcji człowieka (oszczędność ~18h/msc.)
              </li>
              <li>
                Przekazywanie informacji na wiele komunikatorów jednocześnie, takich jak Telegram, Discord, e-mail (oszczędność ~3h/msc.)
              </li>
              <li>Tworzenie spersonalizowanych ofert (oszczędność ~34h/msc.)</li>
              <li>
              Powiadomienia o niskim stanie magazynowym i automatyczne zamawianie produktów (oszczędność ~12h/msc.)
              </li>
            </ul>

            <p>Czy możemy umówić się na krótką rozmowę w dogodnym dla Państwa terminie?</p>
            <p>Pozdrawiam i życzę miłego dnia,</p>

            {/* <Button style={button} href={`${frontendUrl}/app/dashboard`}>
              Verify Email
            </Button> */}

            <Footer />
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default VerificationEmail
