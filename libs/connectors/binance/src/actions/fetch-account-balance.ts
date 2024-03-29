import { Property, createAction } from '@linkerry/connectors-framework'
import { binanceAuth } from '../common/auth'
import { BinanceClient } from '../common/client'

export interface Info {
	makerCommission: string
	takerCommission: string
	buyerCommission: string
	sellerCommission: string
	commissionRates: CommissionRates
	canTrade: boolean
	canWithdraw: boolean
	canDeposit: boolean
	brokered: boolean
	requireSelfTradePrevention: boolean
	preventSor: boolean
	updateTime: string
	accountType: string
	balances: Balance[]
	permissions: string[]
	uid: string
}

export interface CommissionRates {
	maker: string
	taker: string
	buyer: string
	seller: string
}

export interface Balance {
	asset: string
	free: string
	locked: string
}

export const fetchAccountBalance = createAction({
	auth: binanceAuth,
	description: 'Fetch account asset balance ',
	displayName: 'Fetch account balance',
	name: 'fetch_account_balance',
	props: {
		non_zero_assets: Property.Checkbox({
			description: 'Shoould return only non-zero balance assets',
			displayName: 'Only non-zero assets',
			required: true,
			defaultValue: true,
		}),
	},
	run: async ({ auth, propsValue }) => {
		BinanceClient.setAuth(auth)

		const balanceInfo = (await BinanceClient.exchange.fetchBalance()).info as Info

		const balances = propsValue.non_zero_assets
			? balanceInfo.balances.filter((balance) => {
					return +balance.free !== 0 || +balance.locked !== 0
			  })
			: balanceInfo.balances

		if (!balances.length) return 'Empty account balance'

		return balances
	},
	test: async ({ auth, propsValue }) => {
		BinanceClient.setAuth(auth)

		const balanceInfo = (await BinanceClient.exchange.fetchBalance()).info as Info

		const balances = propsValue.non_zero_assets
			? balanceInfo.balances.filter((balance) => {
					return +balance.free !== 0 || +balance.locked !== 0
			  })
			: balanceInfo.balances

		if (!balances.length) return 'Empty account balance'

		return balances
	},
})
