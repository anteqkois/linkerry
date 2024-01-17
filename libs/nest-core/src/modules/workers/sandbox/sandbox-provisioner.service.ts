import { ConnectorPackage, SandBoxCacheType, TypedProvisionCacheInfo } from '@linkerry/shared'
import { Injectable } from '@nestjs/common'
import { SandboxManagerService } from './cache/sandbox-manager.service'
import { sandboxCachePool } from './cache/sandbox-pool'

@Injectable()
export class SandboxProvisionerService {
	constructor(private readonly sandboxManagerService: SandboxManagerService){}

	async provisionSandbox({connectors = [], ...cacheInfo}: GetParams) {
		try {
			const cachedSandbox = await sandboxCachePool.findOrCreate(cacheInfo)

			await cachedSandbox.prepare({
				// projectId,
				connectors,
				// codeSteps,
			})

			const sandbox = await this.sandboxManagerService.allocate()

			await sandbox.assignCache({
				cacheKey: cachedSandbox.key,
				cachePath: cachedSandbox.path(),
			})

			return sandbox
		} catch (error) {
			throw new Error(`Can not provisionSandbox ${JSON.stringify(connectors)}`)
		}
	}
}

type GetParams<T extends SandBoxCacheType = SandBoxCacheType> = TypedProvisionCacheInfo<T> & {
	connectors?: ConnectorPackage[]
	// projectId: ProjectId
	// codeSteps?: CodeArtifact[]
}
