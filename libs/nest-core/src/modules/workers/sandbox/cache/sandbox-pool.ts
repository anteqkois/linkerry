import { Environment, extractProvisionCacheKey, isNil, ProvisionCacheInfo, SandBoxCacheType } from '@linkerry/shared'
import { Logger } from '@nestjs/common'
import { Mutex } from 'async-mutex'
import { CachedSandbox } from './sandbox-cache'

const logger = new Logger('SandboxPool')
const CACHED_SANDBOX_LIMIT = 1000
const cachedSandboxes = new Map<string, CachedSandbox>()
const lock: Mutex = new Mutex()

const sandboxKeyCachePool = {
	async findOrCreate(cacheInfo: ProvisionCacheInfo): Promise<CachedSandbox> {
		logger.debug(`#findOrCreate cacheInfo:`, cacheInfo)

		const key = extractProvisionCacheKey(cacheInfo)

		const cachedSandbox = await lock.runExclusive((): CachedSandbox => {
			const cachedSandbox = cachedSandboxes.get(key)

			if (cachedSandbox) {
				return cachedSandbox
			}

			if (cachedSandboxes.size >= CACHED_SANDBOX_LIMIT) {
				deleteOldestNotInUseOrThrow()
			}

			return createCachedSandbox({ key })
		})

		await cachedSandbox.init()
		return cachedSandbox
	},

	async release({ key }: ReleaseParams): Promise<void> {
		const cachedSandbox = getOrThrow({ key })
		await cachedSandbox.decrementActiveSandboxCount()
	},
}

const sandboxNoCachePool = {
	async findOrCreate(_cacheInfo: ProvisionCacheInfo): Promise<CachedSandbox> {
		return sandboxKeyCachePool.findOrCreate({
			type: SandBoxCacheType.NONE,
		})
	},
	async release({ key }: ReleaseParams): Promise<void> {
		return sandboxKeyCachePool.release({ key })
	},
}

export const sandboxCachePool = process.env['NODE_ENV'] === Environment.Dev ? sandboxNoCachePool : sandboxKeyCachePool

const getOrThrow = ({ key }: GetOrThrowParams): CachedSandbox => {
	const cachedSandbox = cachedSandboxes.get(key)

	if (isNil(cachedSandbox)) {
		throw new Error(`sandbox not found key=${key}`)
	}

	return cachedSandbox
}

const createCachedSandbox = ({ key }: CreateCachedSandboxParams): CachedSandbox => {
	const newCachedSandBox = new CachedSandbox(key)

	cachedSandboxes.set(key, newCachedSandBox)
	return newCachedSandBox
}

const deleteOldestNotInUseOrThrow = (): void => {
	let oldestNotInUseCachedSandbox: CachedSandbox | null = null

	for (const cachedSandbox of cachedSandboxes.values()) {
		if (!cachedSandbox.isInUse()) {
			if (isNil(oldestNotInUseCachedSandbox)) {
				oldestNotInUseCachedSandbox = cachedSandbox
				continue
			}

			if (cachedSandbox.lastUsedAt().isBefore(oldestNotInUseCachedSandbox.lastUsedAt())) {
				oldestNotInUseCachedSandbox = cachedSandbox
			}
		}
	}

	if (isNil(oldestNotInUseCachedSandbox)) {
		throw new Error('[SandboxCachePool#getOldestNotInUseOrThrow] all sandboxes are in use')
	}

	cachedSandboxes.delete(oldestNotInUseCachedSandbox.key)
}

type ReleaseParams = {
	key: string
}

type GetOrThrowParams = {
	key: string
}

type CreateCachedSandboxParams = {
	key: string
}
