/* eslint-disable no-useless-escape */

export const instructions = {
  instructions_webhook_url: `You need to paste webhook URL in the "Notification" tab at Trading View alert.

This URL should be: *https://api.linkerry.com/api/v1/webhooks/\<flow-id\>*.
Replace \<flow-id\> to the current flow ID. You can find this ID by clicking the **"Details"** button on the top menu. For **testing purpose**, you must append "/simulate" to the end of URL, so it should looks like *https://api.linkerry.com/api/v1/webhooks/\<flow-id\>/simulate*. After test back to the previous URL without "/simulate".
**Don't show this URLs to anybody**.`,
  instructions_message: `You need to prepare the correct webhook message. Go to the "Settings" tab for your TradingView alert and fill in the "Message" input. It must be a valid JSON. You can refer to this [TradingView tutorial](https://www.tradingview.com/support/solutions/43000529348-about-webhooks/) on how to create this message and include the necessary data.

This JSON data will be available in the next flow steps. You can use dynamic variables provided by TradingView. Check [this article](https://www.tradingview.com/support/solutions/43000531021-how-to-use-a-variable-value-in-alert/) to learn how to use them.

Correct message can looks like:
\`\`\`
{
  "symbol": "{{ticker}}",
  "price": "{{close}}",
  "price_time": "{{time}}",
  "webhook_time": "{{timenow}}",
  "my_fixed_message": "This is fixed message, it can be use later in flow for example to send to Telegram",
  "to_buy_at_CEX": "BTC/USDT"
}
\`\`\``,
}
