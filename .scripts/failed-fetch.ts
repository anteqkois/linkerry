const main = async () => {
  const response = await fetch('https://pro-api.coingecko.com/api/v3/coins/list/new?&x_cg_pro_api_key={YOUR_KEY}', {
    method: 'GET',
  })

  // console.log(response.ok)
  console.log(await response.json())
  console.log(await response.status)
  console.log(await response.statusText)
}

main()
  .then((c) => c)
  .catch((err) => console.log(err))
