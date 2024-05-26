import axios, { AxiosError } from 'axios'
import { PrivateRegistryPackageItem } from './package-pre-publish-checks'

const getLatestPublishedVersionPrivateRegistry = async (packageName: string, maxRetries: number = 5): Promise<string | null> => {
  const retryDelay = (attempt: number) => Math.pow(4, attempt - 1) * 2000

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const URL =
      process.env.NODE_ENV === 'production'
        ? `https://package-registry.linkerry.com/${packageName}/latest`
        : `http://localhost:4873/${packageName}/latest`

    try {
      const response = await axios<PrivateRegistryPackageItem>(URL, {
        headers:
          process.env.NODE_ENV === 'production'
            ? {
                Authorization: `Bearer ${process.env['REGISTRY_TOKEN']}`,
              }
            : {},
      })
      const version = response.data.version
      console.info(`[getLatestPublishedVersion] packageName=${packageName}, latestVersion=${version}`)
      return version
    } catch (e: any) {
      console.error(e?.message)
      console.log(URL)

      if (attempt === maxRetries) {
        throw e // If it's the last attempt, rethrow the error
      }

      if (e instanceof AxiosError && e.response?.status === 404) {
        console.info(`[getLatestPublishedVersion] packageName=${packageName}, latestVersion=null`)
        return null
      }

      console.warn(`[getLatestPublishedVersion] packageName=${packageName}, attempt=${attempt}, error=${e}`)
      const delay = retryDelay(attempt)
      await new Promise((resolve) => setTimeout(resolve, delay)) // Wait for the delay before retrying
    }
  }

  return null // Return null if all retries fail
}

const main = async () => {
  await getLatestPublishedVersionPrivateRegistry('@linkerry/openai', 1)
  process.exit(0)
}

main()
  .then()
  .catch((err) => console.log(err))
