/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Throttle } from '@nestjs/throttler'

export const StrictRateLimit = () => {
  return Throttle({ default: { limit: +process.env['STRICT_THROTTLE_LIMIT']!, ttl: +process.env['STRICT_THROTTLE_TTL']! } })
}
