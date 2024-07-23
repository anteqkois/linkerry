import { Hr, Text } from '@react-email/components'
import Link from 'next/link'
import React from 'react'
import { anchor, hr, paragraph } from '../styles'

export const Footer = () => {
  return (
    <>
      <Hr style={hr} />
      <Text style={paragraph}>
        tel: +48 577 584 212
        <br />
        e-mail:
        <Link style={anchor} href="mailto:anteqkois@gmail.com">
          anteqkois@gmail.com
        </Link>
        <br />
        <Link style={anchor} href="https://legal.maxdata.app/company.pdf">
          Maxdata App LTD
        </Link>
      </Text>
      <Text style={paragraph}>— Zespół Linkerry</Text>
      {/* <Text style={paragraph}>— The Linkerry team</Text> */}
      <Hr style={hr} />
      {/* <Text style={footer}>Linkerry, 354 Oyster Point Blvd, South San Francisco, CA 94080</Text> */}
    </>
  )
}
