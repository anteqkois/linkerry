import axios from 'axios'

const main = async () => {
  const { data } = await axios.get('https://api.coingecko.com/api/v3/search?query=eth')
  console.log(data)
}

main()
  .then()
  .catch((err) => console.log(err))
