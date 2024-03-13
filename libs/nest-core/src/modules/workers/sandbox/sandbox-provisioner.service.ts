import { ConnectorPackage, CustomError, ErrorCode, SandBoxCacheType, TypedProvisionCacheInfo } from '@linkerry/shared'
import { Injectable, Logger } from '@nestjs/common'
import { SandboxManagerService } from './cache/sandbox-manager.service'
import { sandboxCachePool } from './cache/sandbox-pool'
import { Sandbox } from './sandboxes/sandbox'

@Injectable()
export class SandboxProvisionerService {
	private readonly logger = new Logger(SandboxProvisionerService.name)

	constructor(private readonly sandboxManagerService: SandboxManagerService) {}

	// async provision({ connectors = [], codeSteps = [], ...cacheInfo }: GetParams) {
	async provision({ connectors = [], ...cacheInfo }: GetParams) {
		try {
			const cachedSandbox = await sandboxCachePool.findOrCreate(cacheInfo)

			await cachedSandbox.prepare({
				connectors,
				// codeSteps,
			})

			const sandbox = await this.sandboxManagerService.allocate()

			await sandbox.assignCache({
				cacheKey: cachedSandbox.key,
				cachePath: cachedSandbox.path(),
			})

			return sandbox
		} catch (error: any) {
			this.logger.error(error)
			throw new CustomError(`Can not provision Sandbox`, ErrorCode.ENTITY_NOT_FOUND, {
				connectors,
			})
		}
	}

	async releaseSandbox({ sandbox }: ReleaseParams): Promise<void> {
		this.logger.debug(`#releaseSandbox:`, { boxId: sandbox.boxId, cacheKey: sandbox.cacheKey })

		await this.sandboxManagerService.release(sandbox.boxId)

		if (sandbox.cacheKey) {
			await sandboxCachePool.release({
				key: sandbox.cacheKey,
			})
		}
	}
}

type GetParams<T extends SandBoxCacheType = SandBoxCacheType> = TypedProvisionCacheInfo<T> & {
	connectors?: ConnectorPackage[]
	// codeSteps?: CodeArtifact[]
}

type ReleaseParams = {
	sandbox: Sandbox
}
