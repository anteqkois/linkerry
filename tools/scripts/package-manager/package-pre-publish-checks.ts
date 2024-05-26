import axios, { AxiosError } from 'axios'
import assert from 'node:assert'
import { ExecException } from 'node:child_process'
import { exec } from '../utils/exec'
import { readPackageJson } from '../utils/files'

export interface PrivateRegistryPackageItem {
  name: string
  version: string
  type: 'module'
  scripts: Record<string, string>
  dependencies: Record<string, string>
  // {
  // 	'lodash.merge': '^4.6.2'
  // 	zod: '^3.21.4'
  // }
  module: string // 'index.js'
  main: string // 'index.js'
  readmeFilename: string // 'README.md'
  gitHead: string // 'd45f4bcf6434920ca201e51700552c064d55fa4d'
  description: string
  _id: string // '@linkerry/coingecko@0.0.1'
  _nodeVersion: string // '20.2.0'
  _npmVersion: string // '9.6.6'
  // dist: {
  // 	integrity: 'sha512-VQmkr6uZnDbmqib7VFHWI7AeeCrGB1HrItcLgNc9QV6dhLxjZ9tvTsW+m8S6mz1laV/pih4dfcuXnPypULTULQ=='
  // 	shasum: 'fe0acd1d26aaf6ae7f8959aad458ac9c1d7ae088'
  // 	tarball: 'http://localhost:4873/@linkerry/coingecko/-/coingecko-0.0.1.tgz'
  // }
  author: {
    name: string
    email: string
    url: string
  }
  contributors: {
    name: string
    url: string
  }[]
}

const getLatestPublishedVersionPrivateRegistry = async (packageName: string, maxRetries: number = 5): Promise<string | null> => {
  const retryDelay = (attempt: number) => Math.pow(4, attempt - 1) * 2000

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const URL =
      process.env.NODE_ENV === 'production'
        ? // ? `https://package-registry.linkerry.com/${packageName}/latest`
          `http://64.226.97.74:4873/${packageName}/latest`
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
      console.dir(e.response.data, { depth: null })

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

const packageChangedFromMainBranch = async (path: string): Promise<boolean> => {
  console.info(`[packageChangedFromMainBranch] path=${path}`)

  try {
    const diff = await exec(`git diff --quiet origin/main -- ${path}`)
    return false
  } catch (e) {
    if ((e as ExecException).code === 1) {
      return true
    }

    throw e
  }
}

/**
 * Validates the package before publishing.
 * returns false if package can be published.
 * returns true if package is already published.
 * throws if validation fails.
 * @param path path of package to run pre-publishing checks for
 */
export const packagePrePublishChecks = async (path: string): Promise<boolean> => {
  assert(path, '[packagePrePublishValidation] parameter "path" is required')

  const { name: packageName, version: currentVersion } = await readPackageJson(path)
  const latestPublishedVersion = await getLatestPublishedVersionPrivateRegistry(packageName)
  const currentVersionAlreadyPublished = latestPublishedVersion !== null && currentVersion === latestPublishedVersion

  if (currentVersionAlreadyPublished) {
    // todo
    // const packageChanged = await packageChangedFromMainBranch(path)
    const packageChanged = false

    if (packageChanged) {
      throw new Error(`[packagePrePublishValidation] package version not incremented, path=${path}, version=${currentVersion}`)
    }
    return true
  }

  return false
}
