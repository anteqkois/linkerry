import { Body, Button, Container, Head, Hr, Html, Link, Preview, Section, Text } from '@react-email/components'
import React from 'react'
import { IS_EMAIL_PREVIEW, frontendUrl } from '../constants/veriables'
import { anchor, box, brandName, button, codeBox, confirmationCodeText, container, hr, main, paragraph } from '../styles'

interface Props {
  verificationCode: string
}
const defaaultProps: Props = {
  verificationCode: 'Ver1F1CaT10n',
}

export const VerificationEmail = (props: Props) => {
  const { verificationCode } = IS_EMAIL_PREVIEW ? defaaultProps : props

  return (
    <Html>
      <Head />
      <Preview>You're now ready to start adventure with Linkerry!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            {/* <Img src={`${baseUrl}/static/stripe-logo.png`} width="49" height="21" alt="Stripe" /> */}
            <Text style={brandName}>Linkerry</Text>
            <Hr style={hr} />
            <Text style={paragraph}>Thank you for registering and choosing our product.</Text>
            <Text style={paragraph}>The Linkerry team will try to satisfy each of its clients as much as possible, also you.</Text>
            <Text style={paragraph}>Now, you should verify your email using this code:</Text>

            <Section style={codeBox}>
              <Text style={confirmationCodeText}>{verificationCode}</Text>
            </Section>

            <Button style={button} href={`${frontendUrl}/app/dashboard`}>
              Verify Email
            </Button>
            <Hr style={hr} />
            <Text style={paragraph}>
              If you have any problems or questions, please contact us via e-mail{' '}
              <Link style={anchor} href="mailto:anteqkois@gmail.com">
                anteqkois@gmail.com
              </Link>
              {/* <Link style={anchor} href="mailto:help@linkerry.com">
                help@linkerry.com
              </Link> */}
              , live chat or{' '}
              <Link style={anchor} href="https://web.telegram.org/k/#@anteqkois">
                Telegram
              </Link>
            </Text>
            <Text style={paragraph}>— The Linkerry team</Text>
            <Hr style={hr} />
            {/* <Text style={footer}>Linkerry, 354 Oyster Point Blvd, South San Francisco, CA 94080</Text> */}
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default VerificationEmail
