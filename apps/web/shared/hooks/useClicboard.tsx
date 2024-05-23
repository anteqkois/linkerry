import { useToast } from '@linkerry/ui-components/client'

export const useClipboard = () => {
  const { toast } = useToast()

  const copy = (copyData: string, message?: string) => {
    navigator.clipboard.writeText(copyData).then(
      () => {
        toast({
          title: message ?? 'Data copied',
        })
      },
      () => {
        toast({
          title: 'Can not copy data',
          variant: 'destructive',
        })
      },
    )
  }

  return { copy }
}
