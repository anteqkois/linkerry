import { exec } from '../utils/exec'

type PackageManagerOutput = {
  stdout: string
  stderr: string
}

type CoreCommand = 'add' | 'init' | 'link'
type ExecCommand = 'tsc'
type Command = CoreCommand | ExecCommand

const runCommand = async (path: string, command: Command, ...args: string[]): Promise<PackageManagerOutput> => {
  // try {
  console.debug({ path, command, args }, '[PackageManager#execute]')

  const commandLine = `pnpm ${command} ${args.join(' ')}`
  return await exec(commandLine, { cwd: path })
  // }
  // catch (error) {
  //     console.log(error);
  // }
}

export const packageManager = {
  link({ linkPath, path }: { path: string; linkPath: string }) {
    const config = ['--config.lockfile=false', '--config.auto-install-peers=true']

    return runCommand(path, 'link', linkPath, ...config)
  },
}
