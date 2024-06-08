'use client'

import { useEffect } from 'react'

export const useBodyClass = (className: string) => {
  useEffect(() => {
    document.body.classList.add(className)

    return () => {
      document.body.classList.remove(className)
    }
  }, [className])
}
// 'use client'

// import { useRouter } from 'next/router'
// import { useEffect } from 'react'

// export const useBodyClass = (className: string, route: string) => {
//   const router = useRouter()

//   useEffect(() => {
//     if (router.pathname === route) {
//       document.body.classList.add(className)
//     } else {
//       document.body.classList.remove(className)
//     }

//     return () => {
//       document.body.classList.remove(className)
//     }
//   }, [router.pathname, className, route])
// }
