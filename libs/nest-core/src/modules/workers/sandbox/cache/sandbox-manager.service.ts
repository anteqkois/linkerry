import { isNull } from '@linkerry/shared'
import { Injectable, Logger } from '@nestjs/common'
import { Sandbox } from '../sandboxes/sandbox'

const SANDBOX_LIMIT = 1000

const sandboxes: Sandbox[] = new Array(SANDBOX_LIMIT).fill(null).map((_, i) => new Sandbox({ boxId: i }))

@Injectable()
export class SandboxManagerService {
	private readonly logger = new Logger(SandboxManagerService.name)

	async allocate(): Promise<Sandbox> {
		this.logger.debug('[#allocate]')

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
			throw new Error('[#allocate] all sandboxes are in-use')
		}

		sandbox.inUse = true
		return sandbox
	}

	async release(sandboxId: number): Promise<void> {
		this.logger.log({ boxId: sandboxId }, '[#release]')

		const sandbox = sandboxes[sandboxId]

		if (isNull(sandbox)) {
			throw new Error(`[#release] sandbox not found id=${sandboxId}`)
		}

		sandbox.inUse = false
	}
}

const byNotInUse = (s: Sandbox): boolean => !s.inUse
