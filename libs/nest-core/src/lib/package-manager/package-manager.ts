import { isEmpty } from '@linkerry/shared'
import { Logger } from '@nestjs/common'
import { exec as execCallback } from 'node:child_process'
import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { promisify } from 'node:util'

const npmrcContent = `
strict-peer-dependencies=false
auto-install-peers=true
ignore-scripts=true
registry=\${REGISTRY_USERNAME}:\${REGISTRY_PASSWORD}@\${REGISTRY_URL}
registry=\${REGISTRY_URL}
//\${REGISTRY_URL}/:_authToken=\${REGISTRY_TOKEN}
`

export const exec = promisify(execCallback)
const logger = new Logger('PackageManager')

type PackageManagerOutput = {
  stdout: string
  stderr: string
}

type CoreCommand = 'add' | 'init' | 'link'
type ExecCommand = 'tsc'
type Command = CoreCommand | ExecCommand

export type PackageInfo = {
  /**
   * name or alias
   */
  alias: string

  /**
   * where to get the package from, could be an npm tag, a local path, or a tarball.
   */
  spec: string
}

const runCommand = async (path: string, command: Command, ...args: string[]): Promise<PackageManagerOutput> => {
  const commandLine = `pnpm ${command} ${args.join(' ')}`
  try {
    logger.debug(`#runCommand:`, { commandLine, path })
    return await exec(commandLine, { cwd: path })
  } catch (error: any) {
    logger.error(error)
    throw new Error(error)
  }
}

export const packageManager = {
  async add({ path, dependencies }: AddParams): Promise<PackageManagerOutput> {
    if (isEmpty(dependencies)) {
      return {
        stdout: '',
        stderr: '',
      }
    }

    const config = ['--prefer-offline', '--ignore-scripts', '--config.lockfile=false', '--config.auto-install-peers=true']

    const dependencyArgs = dependencies.map((d) => `${d.alias}@${d.spec}`)
    return runCommand(path, 'add', ...dependencyArgs, ...config)
  },

  async init({ path }: InitParams): Promise<PackageManagerOutput> {
    await writeFile(join(path, '.npmrc'), npmrcContent.trim())

    return runCommand(path, 'init')
  },

  async exec({ path, command }: ExecParams): Promise<PackageManagerOutput> {
    return runCommand(path, command)
  },

  async link({ path, linkPath }: LinkParams): Promise<PackageManagerOutput> {
    const config = ['--config.lockfile=false', '--config.auto-install-peers=true']

    return runCommand(path, 'link', linkPath, ...config)
  },
}

type AddParams = {
  path: string
  dependencies: PackageInfo[]
}

type InitParams = {
  path: string
}

type ExecParams = {
  path: string
  command: ExecCommand
}

type LinkParams = {
  path: string
  linkPath: string
}
