const domain = process.env.FAKTUROWNIA_DOMAIN
const api_token = process.env.FAKTUROWNIA_API_TOKEN
// const api_token = 'process.env.FAKTUROWNIA_API_TOKEN'

import axios from 'axios'
const main = async () => {
  try {
    const response = await axios.get(`https://${domain}.fakturownia.pl/invoices.json`,{
      params:{
        api_token
      }
    })

    console.log(response.data);
  } catch (error: any) {
    console.log(error.response.data);
  }

  process.exit(0)
}

main()
  .then()
  .catch((err) => console.log(err))
