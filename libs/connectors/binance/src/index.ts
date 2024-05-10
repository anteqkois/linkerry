import {
  cancelAllSymbolOrdersActionFactory,
  cancelOrderActionFactory,
  cancelOrdersActionFactory,
  createMarketOrderWithCostActionFactory,
  createOrderActionFactory,
  editOrderActionFactory,
  getAccountBalanceActionFactory,
  getBidsAsksActionFactory,
  getOHLCVActionFactory,
  getOrderActionFactory,
  getOrdersActionFactory,
  getTickersActionFactory,
  getTradesActionFactory,
  getTradingFeeActionFactory,
  setMarginModeActionFactory,
} from '@linkerry/common-exchanges'
import { createConnector } from '@linkerry/connectors-framework'
import { binanceAuth } from './common/auth'
import { BinanceClient } from './common/client'

export const coingecko = createConnector({
  displayName: 'Binance',
  logoUrl:
    'https://lh3.googleusercontent.com/fife/AGXqzDnU98pHKGFIbI-u8e1AoB3LHlpVDazntDE248xo6-B5nkepI7taVL4ZTLDvdhueKcU4uRyDenYOfj_BKzFlwX0QJHv6dcdwCDUXfqmZqo4RpOWm01HKLYv6xbj5mwAGahj3OsyeLYleIfLbP8BgwJChRjFINu-_ltmgXPQmpzK46SwAatTgDQzGnB94DPhR3G1PIEUnXobS3Zg8inShFRUUTBy0xKdlTakXXTHe4NPtDebOr5JxqyowveWPaH9VXgR5tVGYfwRf_3yB_mTwC_BsAQl9k9iDiNZt69IjBO4swClkhe-laX-kgqWU21w34nJw3V3XShTZVinW-SEXGZYaJhCMtT898VMLR8R0zBe436mjrbV994yU9hx4mDxiFU5mLGsaasRSPXoYNp0pEH6ZKzL5mqSDfMjFTV1P7j61juAeBbDrtZLRPytTwYYkQvyXPmUGAZ6bs2OpJLnGnFBZ7DMSN7rWyfTsXdtrGv_ATBN9ERDViBVI7mXe31Wjo7liWYsGHUKYIfK3S03Q2CDxa1uVttiCiGozCxKdP4gjZBuiRXKUm5EnFlh7WfKhIahu09av2GOXMQ8t7ohfOkopO5s74BOFHamOtPVHT4_Zle7u9cd77Q-za3bMejx2BAW7Bg_d6ZvDpRejmGy5NNO7_WwfLI1EpEXacFSQ97I6WNVLpJ59_aHe1erb7yUTj7E2piERl4zPTli91pVWeAHKi_0bK_TumW94m3TNoe5yG4DjLhm0jq4Hnx_1z_RynudG66XUgaU2PjfYZnIlxT0lqg6KUgh9u3tN6kbG20-No3tCmI23stTTPqlQ22Bfn3x7NC9dWmG8WIL3lFl5rKvj--bZCcOYegSejiUkL1B4isBCeoMo0mONxp6cjsL3itG5J8-XdyIrTsU1obzqYj8_KBNsN0o9-umj9uNpHvW0q_iPevcdv6aGjZAQPltauWPAUrb6ZjeT7dpPsxqgB7cNtR4bWnTO-IOxWRVrBtE9kEch0X-I6TyzCNSU6l3k7lKfov0eriHmfn1AMk7x_DMMakoekIV-l46rnIqvTSsafcjxN89dIqu0og_FsdvCz8OC19GqcT3pESHyXXBcL5BVGbPieqSk6WumF1kM-DoNszeE5jyOf_wDzmg7dbEwOhPJCXx6F4_sO52yYIscsKealCyh-JoZ6hp_CQ4eao5ryZhXhyKz1kURp6vVZU8Z8nctFaFuu5wBKMALZ8j74igKXtn_lXfQb_Ep2f-lB8P_6FzBoInO-TJJMrq9mVIP2neiNBOstEhPJ_CZFJMZZ3Jzf1562zaHEYNy7HmdR3N-bA7CiQFaEJpKVtncE7Vz-EStzNSPYwCfhK1KWqeJu491YyeJv4WwwZeDSwlWA4eqIPjhkYn-PKAsMzrVWDSA6HrVOMKBnrxZS9NUuyUxRU5g4yzxENvKEm8ksoy_cIwYqAu2x0SvyCopiu2aumoQ-JpLNkhnAdnPOd0arxGAhnlL85ScZPu8XCpguxssk-XEyCxJX-YKoAyzC3OWVi3N4IWRwfMeJ375Nx99i71RcNroG3A9WnH9evnDnQt1a40wE8UIC7z6dkldL456WKU1pe2ZK9M94APIhMaYyYIMMFE1ZNL7Q1bmXOWXa3oHYb8txnGXZ99olRUQwLA0VvsvB8OlKqxLSXlvfMl5BKbPaUsHk84L=w1084-h973',
  triggers: [],
  description: 'Binance connector for interacting with the bigest cryptocurrency exchange',
  minimumSupportedRelease: '0.0.0',
  actions: [
    cancelAllSymbolOrdersActionFactory(BinanceClient, binanceAuth),
    cancelOrderActionFactory(BinanceClient, binanceAuth),
    cancelOrdersActionFactory(BinanceClient, binanceAuth),
    createMarketOrderWithCostActionFactory(BinanceClient, binanceAuth),
    createOrderActionFactory(BinanceClient, binanceAuth),
    editOrderActionFactory(BinanceClient, binanceAuth),
    getAccountBalanceActionFactory(BinanceClient, binanceAuth),
    getBidsAsksActionFactory(BinanceClient),
    getOHLCVActionFactory(BinanceClient),
    getOrderActionFactory(BinanceClient, binanceAuth),
    getOrdersActionFactory(BinanceClient, binanceAuth),
    getTickersActionFactory(BinanceClient, binanceAuth),
    getTradesActionFactory(BinanceClient, binanceAuth),
    getTradingFeeActionFactory(BinanceClient, binanceAuth),
    setMarginModeActionFactory(BinanceClient, binanceAuth),
  ],
  auth: binanceAuth,
  tags: ['cryptocurrency', 'data feed', 'trends', 'exchange', 'trading'],
})
