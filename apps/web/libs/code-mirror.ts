import { isEmpty } from '@linkerry/shared'

export const prepareCodeMirrorValue = (data: any) => {
  if (typeof data === 'object') return JSON.stringify(data, null, 2)
  if (isEmpty(data)) return ''
  return `${data}`
}
