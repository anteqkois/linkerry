import { isNull } from '@market-connector/shared'
import { Injectable, Logger } from '@nestjs/common'
import { Sandbox } from '../sandboxes/sandbox'

const SANDBOX_LIMIT = 1000

const sandboxes: Sandbox[] = new Array(SANDBOX_LIMIT).fill(null).map((_, i) => new Sandbox({ boxId: i }))

@Injectable()
export class SandboxManagerService {
	private readonly logger = new Logger(SandboxManagerService.name)

	async allocate(): Promise<Sandbox> {
		this.logger.debug('[SandboxManagerService#allocate]')

		const sandbox = this._getSandbox()

		try {
			await sandbox.recreate()
			return sandbox
		} catch (e) {
			this.logger.error(`[#allocate]`, e)
			await this.release(sandbox.boxId)
			throw e
		}
	}

	_getSandbox() {
		const sandbox = sandboxes.find(byNotInUse)

		if (isNull(sandbox)) {
			throw new Error('[SandboxManagerService#allocate] all sandboxes are in-use')
		}

		sandbox.inUse = true
		return sandbox
	}

	async release(sandboxId: number): Promise<void> {
		this.logger.log({ boxId: sandboxId }, '[SandboxManagerService#release]')

		const sandbox = sandboxes[sandboxId]

		if (isNull(sandbox)) {
			throw new Error(`[SandboxManagerService#release] sandbox not found id=${sandboxId}`)
		}

		sandbox.inUse = false
	}
}

const byNotInUse = (s: Sandbox): boolean => !s.inUse
