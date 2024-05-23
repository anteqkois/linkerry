import { InjectRedis } from '@liaoliaots/nestjs-redis'
import { DEDUPE_KEY_PROPERTY } from '@linkerry/connectors-framework'
import { isNil } from '@linkerry/shared'
import { Injectable, Logger } from '@nestjs/common'
import { Redis } from 'ioredis'
import { REDIS_CLIENT_NAMESPACE } from '../../../configs/redis'

@Injectable()
export class DedupeService {
  private readonly DUPLICATE_RECORD_EXPIRATION_SECONDS = 30
  private readonly logger = new Logger(DedupeService.name)

  constructor(@InjectRedis(REDIS_CLIENT_NAMESPACE.SERVER) private readonly redis: Redis) {}

  async filterUniquePayloads(flowVersionId: string, payloads: unknown[]): Promise<unknown[]> {
    const filteredPayloads = await Promise.all(payloads.map(async (payload) => this.isDuplicated(flowVersionId, payload)))
    return payloads.filter((_, index) => !filteredPayloads[index]).map((entry) => this.removeDedupeKey(entry))
  }

  async isDuplicated(flowVersionId: string, payload: unknown) {
    const dedupeKeyValue = this.extractDedupeKey(payload)
    if (isNil(dedupeKeyValue)) {
      return false
    }

    const key = `${flowVersionId}:${dedupeKeyValue}`

    const value = await this.incrementInRedis(key, this.DUPLICATE_RECORD_EXPIRATION_SECONDS)
    return value > 1
  }

  removeDedupeKey(payload: unknown): unknown {
    const dedupeKeyValue = this.extractDedupeKey(payload)
    if (isNil(dedupeKeyValue)) {
      return payload
    }
    return { ...(payload as Record<string, unknown>), [DEDUPE_KEY_PROPERTY]: undefined }
  }

  extractDedupeKey(payload: unknown): unknown {
    if (isNil(payload) || typeof payload !== 'object') {
      return null
    }
    return (payload as Record<string, unknown>)[DEDUPE_KEY_PROPERTY]
  }

  async incrementInRedis(key: string, expireySeconds: number): Promise<number> {
    const value = await this.redis.incrby(key, 1)
    if (value > 1) {
      return value
    }
    await this.redis.expire(key, expireySeconds)
    return value
  }
}
