import { Body, Button, Container, Head, Hr, Html, Link, Preview, Section, Text } from '@react-email/components'
import React from 'react'
import { IS_EMAIL_PREVIEW, colors, frontendUrl } from '../constants/veriables'

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
              <Link style={anchor} href="mailto:help@linkerry.com">
                help@linkerry.com
              </Link>
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

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
}

const box = {
  padding: '0 48px',
}

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
}

const paragraph = {
  color: '#525f7f',

  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'left' as const,
}

const brandName = {
  color: colors.primary,
  fontWeight: 'bolder',
  fontSize: '48px',
  lineHeight: '36px',
  textAlign: 'left' as const,
}

const anchor = {
  color: '#556cd6',
}

const button = {
  backgroundColor: colors.primary,
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '100%',
  padding: '10px',
}

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
}

const codeBox = {
  background: 'rgb(245, 244, 245)',
  borderRadius: '10px',
  marginBottom: '30px',
  padding: '20px 10px',
}

const confirmationCodeText = {
  fontSize: '30px',
  textAlign: 'center' as const,
  verticalAlign: 'middle',
}
