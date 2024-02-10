import { HttpMethod, httpClient } from '../../../../libs/connectors/common/src'

const main = async () => {
	const response = await httpClient.sendRequest({
		method: HttpMethod.GET,
		url: 'https://api.coingecko.com/api/v3/search?',
		queryParams: {
			query: 'btc',
		},
	})
	console.log(response)

	const response2 = await fetch(
		`https://api.coingecko.com/api/v3/search?${new URLSearchParams({
			query: 'btc',
		})}`,
		{
			method: 'GET',
		},
	)
	console.log(await response2.json())
}

main()
	.then()
	.catch((err) => console.log(err))
