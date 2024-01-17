import { HttpMethod, httpClient } from '../../../libs/connectors/common/src'

const main = async () => {
	console.log(
		await httpClient.sendRequest({
			method: HttpMethod.GET,
			url: 'https://api.coingecko.com/api/v3/coins/bittensor',
		}),
	)
}

main()
	.then()
	.catch((err) => console.log(err))
