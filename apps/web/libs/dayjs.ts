import dayjs from 'dayjs'
import 'dayjs/locale/en'
import 'dayjs/locale/pl'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useEffect, useState } from 'react'

// dayjs.locale(localStorage.getItem('lang') || 'en')
dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)

export const useDayjs = () => {
	return {
		dayjs,
	}
}

export const useRelativeTime = (time?: string) => {
	const [relativeTime, setRelativeTime] = useState<string>()
	const [initialTime, setInitialTime] = useState(time ?? '')

	useEffect(() => {
		if (!initialTime) return

		setRelativeTime(dayjs().to(dayjs(initialTime)))
		const interval = setInterval(() => {
			setRelativeTime(dayjs().to(dayjs(initialTime)))
		}, 10_000)

		return () => clearInterval(interval)
	}, [initialTime])

	return {
		relativeTime,
		setInitialTime,
		dayjs,
	}
}
