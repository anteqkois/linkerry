'use client'

import { useTheme } from 'next-themes'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { MacOSWindow } from './MacOSWindow'

export const HeroImage = () => {
  const { theme } = useTheme()
  const [key, setKey] = useState<string>('default')

  useEffect(() => {
    setKey(theme ?? '')
  }, [theme])

  return (
    <MacOSWindow className="absolute top-0 left-0">
      <Image
        key={key}
        src={theme === 'light' ? '/images/landing/hero-editor-light-1-optymalized.png' : '/images/landing/hero-editor-dark-1-optymalized.png'}
        // src={'/images/landing/hero-editor-dark-1.png'}
        width={2880}
        height={1800}
        alt="Linkerry flow editor"
      />
    </MacOSWindow>
  )
}
