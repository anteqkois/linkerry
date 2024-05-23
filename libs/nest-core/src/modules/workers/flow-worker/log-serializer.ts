import { ExecutioOutputFile, FileCompression } from '@linkerry/shared'
import { Logger } from '@nestjs/common'
import { fileCompressor } from '../../../lib/helpers/file-compressor'

const logger = new Logger('LogSerializer')
export const logSerializer = {
  async serialize(log: ExecutioOutputFile): Promise<Buffer> {
    const stringifiedLog = JSON.stringify(log, memoryFileReplacer)
    const binaryLog = Buffer.from(stringifiedLog)

    const compressedLog = await fileCompressor.compress({
      data: binaryLog,
      compression: FileCompression.GZIP,
    })

    logger.debug(`#serialize binaryLog.byteLength=${binaryLog.byteLength}; compressedLog.byteLength=${compressedLog.byteLength}`)

    return compressedLog
  },
}

const memoryFileReplacer = (_key: string, value: unknown): unknown => {
  if (typeof value === 'string' && value.startsWith('memory://')) {
    return '[TRUNCATED]'
  }

  return value
}
