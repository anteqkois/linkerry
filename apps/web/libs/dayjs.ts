import dayjs from 'dayjs'
import 'dayjs/locale/pl'
import 'dayjs/locale/en'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedFormat from 'dayjs/plugin/localizedFormat'

// dayjs.locale(localStorage.getItem('lang') || 'en')
dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)

export { dayjs }
