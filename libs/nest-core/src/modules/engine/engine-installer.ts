import { Logger } from '@nestjs/common'
import { copyFile } from 'node:fs/promises'

const engineExecutablePath = process.env['ENGINE_EXECUTABLE_PATH']
const logger = new Logger('EngineInstaller')

/**
 * Installs the engine executable to the given path
 */
export const engineInstaller = {
	async install({ path }: InstallParams): Promise<void> {
		logger.debug(`#install`, { path })

		if (!engineExecutablePath) throw new Error('Missing ENGINE_EXECUTABLE_PATH env')
		await copyFile(engineExecutablePath, `${path}/main.js`)
		await copyFile(`${engineExecutablePath}.map`, `${path}/main.js.map`)
	},
}

type InstallParams = {
	path: string
}
