import axios from 'axios'

const main = async () => {
  const response = await axios.get('https://api.coingecko.com/api/v3/ping', {
    headers: {
      'x-cg-demo-api-key': process.env['COINGECKO_API_KEY'],
    },
  })

  console.log(response.data.gecko_says)

  process.exit(0)
}

main()
  .then()
  .catch((err) => console.log(err))
