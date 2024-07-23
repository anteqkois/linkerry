'use client'

import { useTheme } from 'next-themes'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export const CompaniesHeroImage = () => {
  const { theme } = useTheme()
  const [key, setKey] = useState<string>('default')

  useEffect(() => {
    setKey(theme ?? '')
  }, [theme])

  return (
    <Image
      className="brightness-[0.9] hover:brightness-100 dark:brightness-[0.6] dark:hover:brightness-100"
      objectFit="contain"
      key={key}
      src={theme === 'light' ? '/images/landing/companies/companies-light.svg' : '/images/landing/companies/companies-dark.svg'}
      width={2880}
      height={1800}
      alt="Some of avaible apps"
    />
  )
}
