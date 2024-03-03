import { Environment, assertNotNullOrUndefined } from '@linkerry/shared'
import dns from 'node:dns/promises'

const GOOGLE_DNS = '216.239.32.10'
const PUBLIC_IP_ADDRESS_QUERY = 'o-o.myaddr.l.google.com'

let ipMetadata: IpMetadata | undefined

const getPublicIp = async (): Promise<IpMetadata> => {
	if (ipMetadata !== undefined) {
		return ipMetadata
	}

	dns.setServers([GOOGLE_DNS])

	const ipList = await dns.resolve(PUBLIC_IP_ADDRESS_QUERY, 'TXT')

	ipMetadata = {
		ip: ipList[0][0],
	}

	return ipMetadata
}

type IpMetadata = {
	ip: string
}

export const getServerUrl = async (): Promise<string> => {
	// const environment = system.get(SystemProp.ENVIRONMENT)
	const environment = process.env['NODE_ENV']

	let url = environment === Environment.Prod ? process.env['FRONTEND_HOST'] : process.env['WEBHOOK_URL']

	assertNotNullOrUndefined(url, 'webhookUrl')

	// Localhost doesn't work with webhooks, so we need try to use the public ip
	if (extractHostname(url) == 'localhost' && environment === Environment.Prod) {
		url = `http://${(await getPublicIp()).ip}`
	}

	const slash = url.endsWith('/') ? '' : '/'
	const redirect = environment === Environment.Prod ? 'api/' : ''

	return `${url}${slash}${redirect}`
}

function extractHostname(url: string): string | null {
	try {
		const hostname = new URL(url).hostname
		return hostname
	} catch (e) {
		return null
	}
}
