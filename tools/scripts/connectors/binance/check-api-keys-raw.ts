import crypto from 'crypto'
import dayjs from 'dayjs'
import 'dotenv/config'
import { HttpMethod, httpClient } from '../../../../libs/connectors/common/src'

/* based on official library https://github.com/binance/binance-connector-typescript */
export function removeEmptyValue(obj: object): object {
	if (!(obj instanceof Object)) return {}
	return Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== null && value !== undefined && value !== ''))
}

function stringifyKeyValuePair([key, value]: [string, string]) {
	const valueString = Array.isArray(value) ? `["${value.join('","')}"]` : value
	return `${key}=${encodeURIComponent(valueString)}`
}

export function buildQueryString(params: object): string {
	if (!params) return ''
	return Object.entries(params).map(stringifyKeyValuePair).join('&')
}

const prepareSignedPath = (path: string, options?: object): string => {
	const timeStamp = Date.now()
	const newOptions = { ...options, timestamp: timeStamp }
	options = removeEmptyValue(newOptions)
	const params = buildQueryString(options)
	let signature = crypto.createHmac('sha256', process.env.BINANCE_SECRET_KEY).update(params).digest('hex')

	return `${path}?${params}&signature=${signature}`
}

const main = async () => {
	const options = {}
	const path = prepareSignedPath('/sapi/v3/asset/getUserAsset', options ? options : {})

	console.log(
		await httpClient.sendRequest({
			method: HttpMethod.POST,
			url: `https://api.binance.com${path}`,
			headers: {
				'Content-Type': 'application/json',
				'X-MBX-APIKEY': process.env.BINANCE_API_KEY,
			},
			body: {
				timestamp: dayjs().unix(),
			},
		}),
	)
	process.exit(0)
}

main()
	.then()
	.catch((err) => console.log(err))
