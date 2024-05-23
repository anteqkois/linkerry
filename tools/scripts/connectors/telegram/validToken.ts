import axios, { isAxiosError } from 'axios'

const main = async () => {
  try {
    // await axios.get('https://api.telegram.org/bot523444/getMe')
    await axios.get('https://api.telegram.org/bot523444/getMe', {
      params: {
        siema: 1,
      },
    })
    // await axios.post('https://api.telegram.org/bot523444/getMe', {
    // 	siema: 1,
    // 	siema2: 2
    // })
  } catch (error) {
    if (isAxiosError(error)) {
      console.log(error.response.headers)

      // console.log(error.config.headers)
      // console.log(error.config.params)
      // console.log(error.config.method)
      // console.log(error.config.url)
      // console.log(error.config.data)

      // console.log(error.request._header)
      // console.log(error.request.protocol)
      // console.log(error.request.host)
      // console.log(error.request.path)
    }
  }

  process.exit(0)
}

main()
  .then()
  .catch((err) => console.log(err))
