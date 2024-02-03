import merge from 'lodash.merge'

const base = {
	name: 'trigger_1',
	valid: false,
	displayName: 'Top trending coins',
	type: 'CONNECTOR',
	settings: {
		connectorName: '@linkerry/coingecko',
		connectorVersion: '0.0.1',
		triggerName: 'trending_coins',
		connectorType: 'Official',
		input: {},
		inputUiInfo: {
			before:1
		},
	},
	nextActionName: '',
}

const main = async () => {
	console.log(
		merge(base, {
			valid: true,
			settings: {
				inputUiInfo: {
					currentData: [],
					testXD: 123,
				},
			},
		}),
	)

	process.exit(0)
}

main()
	.then()
	.catch((err) => console.log(err))
