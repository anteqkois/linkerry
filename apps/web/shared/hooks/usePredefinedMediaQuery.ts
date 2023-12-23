import { useMediaQuery } from "@react-hookz/web"

export const usePredefinedMediaQuery = () => {
  const isMobile = useMediaQuery('only screen and (max-width : 769px)')

  return {
    isMobile
  }
}
