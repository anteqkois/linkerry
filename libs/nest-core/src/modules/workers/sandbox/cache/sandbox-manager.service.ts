import { isNil } from '@linkerry/shared'
import { Injectable, Logger } from '@nestjs/common'
import { Mutex } from 'async-mutex'
import { Sandbox } from '../sandboxes/sandbox'

const SANDBOX_LIMIT = 1000

const sandboxes: Sandbox[] = new Array(SANDBOX_LIMIT).fill(null).map((_, i) => new Sandbox({ boxId: i }))

@Injectable()
export class SandboxManagerService {
	private readonly logger = new Logger(SandboxManagerService.name)
	private readonly lock: Mutex = new Mutex()

	async allocate(): Promise<Sandbox> {
		// this.logger.debug('#allocate')

		const sandbox = await this._executeWithLock((): Sandbox => {
			const sandbox = sandboxes.find(byNotInUse)

			if (isNil(sandbox)) {
				throw new Error('#allocate all sandboxes are in-use')
			}

			sandbox.inUse = true
			return sandbox
		})

		try {
			await sandbox.recreate()
			return sandbox
		} catch (e) {
			this.logger.error(`#allocate`, e)
			await this.release(sandbox.boxId)
			throw e
		}
	}

	async release(sandboxId: number): Promise<void> {
		this.logger.debug(`#release`, { boxId: sandboxId })

		await this._executeWithLock((): void => {
			const sandbox = sandboxes[sandboxId]

			if (isNil(sandbox)) {
				throw new Error(`[#release] sandbox not found id=${sandboxId}`)
			}

			sandbox.inUse = false
		})
	}

	private async _executeWithLock<T>(methodToExecute: () => T): Promise<T> {
		const releaseLock = await this.lock.acquire()

		try {
			return methodToExecute()
		} finally {
			releaseLock()
		}
	}
}

const byNotInUse = (s: Sandbox): boolean => !s.inUse
