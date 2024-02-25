import { EngineResponseStatus } from '@linkerry/shared'
import { Logger } from '@nestjs/common'
import { spawn } from 'node:child_process'
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { AbstractSandbox, ExecuteSandboxResult, SandboxCtorParams } from './abstract-sandbox'

export class FileSandbox extends AbstractSandbox {
	private readonly logger = new Logger(FileSandbox.name)

	public constructor(params: SandboxCtorParams) {
		super(params)
	}

	public override async recreate(): Promise<void> {
		this.logger.debug(`#recreate:`, {
			boxId: this.boxId,
		})

		const sandboxFolderPath = this.getSandboxFolderPath()

		try {
			await rm(sandboxFolderPath, { recursive: true })
		} catch (e) {
			this.logger.error(`#recreate rm failure; sandboxFolderPath`, { sandboxFolderPath })
		}

		await mkdir(sandboxFolderPath, { recursive: true })
	}

	public override async runOperation(operation: string): Promise<ExecuteSandboxResult> {
		const startTime = Date.now()
		const connectorsSources = process.env['CONNECTORS_SOURCE']
		const apiUrl = process.env['API_GATEWAY_URL']

		const command = [
			`cd ${this.getSandboxFolderPath()}`,
			'&&',
			`env -i CONNECTORS_SOURCE=${connectorsSources}`,
			`API_GATEWAY_URL=${apiUrl}`,
			`NODE_OPTIONS='--enable-source-maps'`,
			AbstractSandbox.nodeExecutablePath,
			'main.js',
			operation,
		].join(' ')

		const result = await this.runUnsafeCommand(command)

		let engineResponse

		if (result.verdict === EngineResponseStatus.OK) {
			engineResponse = await this.parseFunctionOutput()
		}

		return {
			timeInSeconds: (Date.now() - startTime) / 1000,
			verdict: result.verdict,
			output: engineResponse?.response,
			standardOutput: await readFile(this.getSandboxFilePath('_standardOutput.txt'), { encoding: 'utf-8' }),
			standardError: await readFile(this.getSandboxFilePath('_standardError.txt'), { encoding: 'utf-8' }),
		}
	}

	public override getSandboxFolderPath(): string {
		return path.join(__dirname, `../../sandbox/${this.boxId}`)
	}

	protected override async setupCache(): Promise<void> {
		this.logger.debug(`#setupCache:`, { boxId: this.boxId, cacheKey: this._cacheKey, cachePath: this._cachePath })

		if (this._cachePath) {
			await cp(this._cachePath, this.getSandboxFolderPath(), { recursive: true })
		}
	}

	private async runUnsafeCommand(cmd: string): Promise<{ verdict: EngineResponseStatus }> {
		const standardOutputPath = this.getSandboxFilePath('_standardOutput.txt')
		const standardErrorPath = this.getSandboxFilePath('_standardError.txt')

		await writeFile(standardOutputPath, '')
		await writeFile(standardErrorPath, '')

		return new Promise((resolve, reject) => {
			const [command, ...args] = cmd.split(' ')
			const process = spawn(command, args, { shell: true })

			let stdout = ''
			let stderr = ''

			process.stdout.on('data', (data: string) => {
				stdout += data
			})

			process.stderr.on('data', (data: string) => {
				stderr += data
			})

			process.on('error', (error: unknown) => {
				reject(error)
			})

			process.on('close', async (code: number) => {
				if (code !== 0) {
					reject(new Error(`Command failed with code ${code}: ${cmd}`))
					// return
				}

				if (stdout) {
					await writeFile(standardOutputPath, stdout)
				}

				if (stderr) {
					// Don't return an error, because it's okay for engine to print errors, and they should be caught by the engine
					await writeFile(standardErrorPath, stderr)
				}

				resolve({ verdict: EngineResponseStatus.OK })
			})

			setTimeout(() => {
				process.kill()
				resolve({ verdict: EngineResponseStatus.TIMEOUT })
			}, AbstractSandbox.sandboxRunTimeSeconds * 1000)
		})
	}
}
