import { ConnectorAuth, OAuth2AuthorizationMethod, createConnector } from '@linkerry/connectors-framework'
import { getRowsAction } from './actions/get-rows'
import { newRowAdded } from './triggers/new-row-added-webhook'

export const googleSheetsAuth = ConnectorAuth.OAuth2({
	description: '',
	authUrl: 'https://accounts.google.com/o/oauth2/auth',
	tokenUrl: 'https://oauth2.googleapis.com/token',
	required: true,
	scope: ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive.readonly'],
	authorizationMethod: OAuth2AuthorizationMethod.BODY,
})

export const coingecko = createConnector({
	displayName: 'Google Sheets',
	logoUrl:
		'https://lh3.googleusercontent.com/fife/ALs6j_G-7mdTAz5hRF9ovA-eRIOqP9JYHexKhzxTgPsYLpXWw55ShRjrqftX7teFcRxNBImeuVjxKWjCYlBO1CBPBiebPeUjaJGF842cYw_ZaW26Lm1EiW5b7KaGjWsQBesX9aP3ZAplHUj49BZA3e1jk0o48aYtLjnCmCHrYNIHnzce1ffr1jcBG4o07nO8kx19lXfO6jNlqN5ffxPQxRILVJykUX9VINi_OFVbtJElX3fBqVDoCtwnNtyabWnf4f15NRT6msbwwr3fNfnxH1Us_rfoI03RuOFyeijM3U0y4eI3sT8rMCdGRwm9Dao3nLsHfmyDn3wXoNnpjpeR6RN3_hMtvYhdh4w6IYimX_DwvZC9KYv-LJFXGYkgNYNXS5QeQntnAo5yy4HsA_wHYdSxSeT4t8NUaTgCecTmIZuRtt4sIecas6bY2XHuLjJvSPv-D0gi0St6_s2vUXCfIetq85dIaLmnDxZhekGFvhD6WVE9BVlEJSXuwHQOhNPvQoKNSw4qg_006O0q1Y8hn7Xr02AgLGH5ijdwSKKcOIBvpp2oYFhzM32yUA8n-lwFXAgWFpii9v8m5TWuJbQpZDIwH4MX_niBlOi184X2hP60rtw6-S656NuZhOjaNNUwZ9NR0w1xc4e7ihr-q_ztqpdSvS5I5zUsPLyznT8Ty4In_LTfDhBX124RX7sgu6G1haQi8y5bmyaCmY7K5sZRfqy8ZzEguPqq7FAhQd6aaPesPIqU44IbSnUnWSYyHBx32r5_y88iLWRPX362qLVhPk_hzONQGqiubDR2Dca9y7NrNpQZPWaAWVf58oQiClcC7XVKn1cpjexRpq6MpiotdL10TDb78Yv9Rq8Eepd_5THxdQ4mMHEeA4qvcYBpMGogagi_0U67V0FT4Ii9HRa_WO2qTxcvErH0MJVUqe4tPbIXJ1m31D4ZCWYcJQtJx9z3Pvcg8G37APjt60JO_sTNgCGM0kJqfVMUCsNYzCoRLlsSRqwQCKAFlVRV4QPhRrZj3cfIxoAV_X7F_ZRQQ1TxQoHUrKbmo7zLuDpnpmoFoWJlILhNAWLnVKASwpOxMJ4_Nk21L_ce8dGkJYNCp36rPaMe3Wx2xCNPyE0ph2--zZ2SiAPYOHQLk00Wx_MTXqbPdyO_pZCwAMLV26f-Vmc5Gbg9G5Zaj68bjX8rfk2P-Q4Ml7VpbK-k-CYRGDYcdegNOSxN4oogSGAL0eJYIHOLSA_V5tYQ7kVV9yBDcgWdjV8bjUlAobl2yHOC8kqROl58Xy0dxzW-CuzIOBfnpBF-6mUT-UGdszqg1i1z0GCxfMnrSLnU1M5ZoALaFzC2eUoMkPHuFce8DqHhYM0zqdqYXeuEAi-F2SpEFkmB8Kv5kNcwqSaQ16W3h3893ZBfwf_q_SmN4HI5ADzFWYMYza8AWtd6AwGGWRnuCkq6Q1Nv-n2U2jItKwMOSO9fwDLz7SnaXCWes9b17Mn2AhMIIdSZaFeIKosxHRAIw-lRa0J2X052khrITZ7InVy6Q9U7Fada_sQfEOa8lp2jNG3_aoGnUt-4tAT1Qw6SQIdIef4dTS4CUx3kCPbiK1YopNE1oSKwPECokFANm-h1-hSo-8yyeF2SuyCjRVurrmHkFuu-lxloMBJ5chSrUD5jHY2t8JEmkovg0JKcjT2kQpq3i-QnhIZigoEQchiTrJovcnyGR9aSPQJXZ3N2bEkei3VlPl_FOTGopz62jySpcKeaJnpZ2Ewm6bqsF3em0WmCdYXZEaFzsFNuUt4vD9KZ4i3X2P-SHCk2=w1880-h1554',
	triggers: [newRowAdded],
	description: 'Create sheets, data analysis and collaborate live',
	minimumSupportedRelease: '0.0.0',
	actions: [getRowsAction],
	auth: googleSheetsAuth,
	tags: ['office', 'collaboration', 'data management'],
})
