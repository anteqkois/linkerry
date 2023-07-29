// TODO Not implemented
export interface ICurrency {}
// {
//   'id':       'btc',       // string literal for referencing within an exchange
//   'code':     'BTC',       // uppercase unified string literal code the currency
//   'name':     'Bitcoin',   // string, human-readable name, if specified
//   'active':    true,       // boolean, currency status (tradeable and withdrawable)
//   'fee':       0.123,      // withdrawal fee, flat
//   'precision': 8,          // number of decimal digits "after the dot" (depends on exchange.precisionMode)
//   'deposit':   true        // boolean, deposits are available
//   'withdraw':  true        // boolean, withdraws are available
//   'limits': {              // value limits when placing orders on this market
//       'amount': {
//           'min': 0.01,     // order amount should be > min
//           'max': 1000,     // order amount should be < max
//       },
//       'withdraw': { ... }, // withdrawal limits
//       'deposit': {...},
//   },
//   'networks': {...}        // network structures indexed by unified network identifiers (ERC20, TRC20, BSC, etc)
//   'info': { ... },         // the original unparsed currency info from the exchange
// }
