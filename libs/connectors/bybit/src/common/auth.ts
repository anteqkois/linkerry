import { exchangeAuth } from '@linkerry/common-exchanges'
import { BybitClient } from './client'

const authDescription = `

1. Hover on account menu.
2. Select **API** from right drawer.
3. Start process to create new API Keys.
4. Choose **System-generated API Keys** option.
5. Fill form* and generate API Keys. Chose **API Transaction** for usage.
6. Congratulations! You have generated your API Keys.

*Set **No IP restriction** (our flows runs on multiple servers). Remember to unlock the restrictions that you will use. So if you want to trade, unlock **Standard Account** and select necessary options.
`

export const bybitAuth = exchangeAuth(BybitClient, authDescription)
