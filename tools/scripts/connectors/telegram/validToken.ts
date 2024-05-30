import { HttpError, HttpMethod, HttpRequest, httpClient } from '../../../../libs/connectors/common/src/lib/http'
// import { HttpMethod, HttpRequest, httpClient } from '@linkerry/connectors-common'

const main = async () => {
  const botToken = 'bot423423'
  const methodName = 'getMe'

  const request: HttpRequest = {
    method: HttpMethod.GET,
    url: `https://api.telegram.org/bot${botToken}/${methodName}`,
  }

  try {
    const response = await httpClient.sendRequest(request)

    if (response.body.ok)
      return {
        valid: true,
      }
    else
      return {
        valid: true,
        error: 'Invalid Bot Token',
      }
  } catch (error: any) {
    if (HttpError.isHttpError(error)) {
      const responseDescription = (error.axiosError.response.data as any)?.description
      if (responseDescription?.includes('Not Found')) {
        return {
          valid: false,
          error: 'Invalid Bot Token, bot not found',
        }
      } else {
        console.log(error.axiosError.response.data)
        return {
          valid: false,
          error: responseDescription,
        }
      }
    }
  }
}

main()
  .then()
  .catch((err) => console.log(err))
