import { HttpStatusCode } from 'axios'
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
      if (error.axiosError.status === HttpStatusCode.NotFound)
        return {
          valid: false,
          error: 'Invalid Bot Token, bot not found',
        }
      else
        return {
          valid: false,
          error: error.axiosError.response.data,
        }
    }

  }
}

main()
  .then()
  .catch((err) => console.log(err))
