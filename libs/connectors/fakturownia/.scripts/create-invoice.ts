const domain = process.env.FAKTUROWNIA_DOMAIN
const api_token = process.env.FAKTUROWNIA_API_TOKEN
// const api_token = 'process.env.FAKTUROWNIA_API_TOKEN'

import axios from 'axios'
const main = async () => {
  try {
    const response = await axios.post(`https://${domain}.fakturownia.pl/invoices.json`, {
      api_token,
      invoice: {
        kind: 'vat',
        number: null,
        sell_date: 'sell_date',
        issue_date: 'issue_date',
        payment_to: 'payment_to',
        seller_name: 'propsValue.seller_name',
        seller_tax_no: 'propsValue.seller_tax_no',
        buyer_name: 'propsValue.buyer_name',
        buyer_email: 'propsValue.buyer_email',
        buyer_tax_no: 'propsValue.buyer_tax_no',
        positions: 'propsValue.products',
      },
    })

    console.log(response.data)
  } catch (error: any) {
    console.log(error.response.data);
  }

  process.exit(0)
}

main()
  .then()
  .catch((err) => console.log(err))
