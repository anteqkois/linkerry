import { ConnectorPackage } from '@linkerry/shared'
import { Logger } from '@nestjs/common'
import dayjs from 'dayjs'
import { mkdir, rm } from 'node:fs/promises'
import { resolve } from 'node:path'
import { engineInstaller } from '../../../engine/engine-installer'
import { connectorManager } from '../../../flows/connectors/connector-manager'

export class CachedSandbox {
	private readonly logger = new Logger(CachedSandbox.name)
	private static readonly cachePath = process.env['CACHE_PATH'] || resolve('dist', 'cache')
	private _state = CachedSandboxState.CREATED
	private _activeSandboxCount = 0
	private _lastUsedAt = dayjs()

	constructor(public readonly key: string) {}

	path(): string {
		return `${CachedSandbox.cachePath}/sandbox/${this.key}`
	}

	lastUsedAt(): dayjs.Dayjs {
		return this._lastUsedAt
	}

	isInUse(): boolean {
		return this._activeSandboxCount > 0
	}

	async init(): Promise<void> {
		this.logger.debug(`#init:`, {
			key: this.key,
			state: this._state,
			activeSandboxes: this._activeSandboxCount,
		})

		if (this._state !== CachedSandboxState.CREATED) {
			return
		}

		await this.deletePathIfExists()

		const fullPath = this.path()
		this.logger.debug(`#init fullPath:`, {
			fullPath,
		})
		await mkdir(fullPath, { recursive: true })
		this._state = CachedSandboxState.INITIALIZED
	}

	// async prepare({ projectId, connectors, codeSteps = [] }: PrepareParams): Promise<void> {
	async prepare({ connectors, codeSteps = [] }: PrepareParams): Promise<void> {
		this.logger.debug(`#prepare:`, { key: this.key, state: this._state, activeSandboxes: this._activeSandboxCount })

		try {
			const notInitialized = this._state === CachedSandboxState.CREATED
			if (notInitialized) {
				throw new Error(`CachedSandbox not initialized, Key=${this.key} state=${this._state}`)
			}

			this._activeSandboxCount += 1
			this._lastUsedAt = dayjs()

			const alreadyPrepared = this._state !== CachedSandboxState.INITIALIZED
			if (alreadyPrepared) {
				return
			}

			await connectorManager.install({
				// projectId,
				projectPath: this.path(),
				connectors,
			})

			await engineInstaller.install({
				path: this.path(),
			})

			// await this.buildCodeArchives(codeSteps)

			this._state = CachedSandboxState.READY
		} catch (error) {
			const contextValue = {
				args: { connectors, codeSteps },
				state: this._state,
				activeSandboxes: this._activeSandboxCount,
				key: this.key,
				lastUsedAt: this.lastUsedAt(),
				isInUse: this.isInUse(),
				path: this.path(),
			}

			this.logger.error(error)
			throw new Error(`Can not prepare snadbox ${JSON.stringify(contextValue)}`)
		}
	}

	async decrementActiveSandboxCount(): Promise<void> {
		this.logger.debug(`#decrementActiveSandboxCount:`, { key: this.key, state: this._state, activeSandboxes: this._activeSandboxCount })

		if (this._activeSandboxCount === 0) {
			return
		}

		this._activeSandboxCount -= 1
	}

	private deletePathIfExists(): Promise<void> {
		return rm(this.path(), { recursive: true, force: true })
	}

	// private async buildCodeArchives(codeArchives: CodeArtifact[]): Promise<void> {
	// 	const buildJobs = codeArchives.map((archive) =>
	// 		codeBuilder.processCodeStep({
	// 			sourceCodeId: archive.name,
	// 			sourceCode: archive.sourceCode,
	// 			buildPath: this.path(),
	// 		}),
	// 	)
	// 	await Promise.all(buildJobs)
	// }
}

type PrepareParams = {
	// projectId: string
	connectors: ConnectorPackage[]
	codeSteps?: any[]
	// codeSteps?: CodeArtifact[]
}

export enum CachedSandboxState {
	/**
	 * Sandbox object was created
	 */
	CREATED = 'CREATED',

	/**
	 * Init method was called on sandbox
	 */
	INITIALIZED = 'INITIALIZED',

	/**
	 * Dependencies, connectors, engine were installed on the sandbox, and it's ready to serve requests
	 */
	READY = 'READY',
}
