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
        sell_date: '2024-07-18',
        issue_date: '2024-07-18',
        payment_to: '2024-07-25',
        // if seller not provided, the default from fakturowani setttings will be use4d
        seller_name: undefined,
        seller_tax_no: undefined,
        buyer_name: 'Client1 TEST SA',
        buyer_email: 'test@gmail.com',
        buyer_tax_no: '6272616681', // can be also 'PL6272616681'
        positions: [{ name: 'Szkolenie miesięczne - pakiet MAIN', tax: 23, total_price_gross: 738, quantity: 1 }],
        // // not works now
        // positions: [
        //   {
        //     product_id: 647823467823,
        //     quantity: 2,
        //   },
        // ],
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
