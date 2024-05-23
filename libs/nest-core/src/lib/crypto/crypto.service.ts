import { CustomError, EncryptedObject, ErrorCode, isEmpty } from '@linkerry/shared'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

@Injectable()
export class CryptoService {
  private readonly ivLength = 16
  private readonly algorithm = 'aes-256-cbc'
  SECRET: string

  constructor(private readonly configService: ConfigService) {
    this.SECRET = this.configService.getOrThrow<string>('ENCRYPTION_KEY')
    if (isEmpty(this.SECRET)) throw new CustomError(`ENCRYPTION_KEY is empty`, ErrorCode.SYSTEM_ENV_INVALID)
  }

  encryptString(inputString: string, customSecret?: string): EncryptedObject {
    const iv = randomBytes(this.ivLength) // Generate a random initialization vector
    const key = Buffer.from(customSecret ?? this.SECRET, 'binary')
    const cipher = createCipheriv(this.algorithm, key, iv) // Create a cipher with the key and initialization vector
    let encrypted = cipher.update(inputString, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    return {
      iv: iv.toString('hex'),
      data: encrypted,
    }
  }

  encryptObject(object: unknown, customSecret?: string): EncryptedObject {
    const objectString = JSON.stringify(object) // Convert the object to a JSON string
    return this.encryptString(objectString)
  }

  decryptObject<T>(encryptedObject: EncryptedObject, customSecret?: string): T {
    const iv = Buffer.from(encryptedObject.iv, 'hex')
    const key = Buffer.from(customSecret ?? this.SECRET, 'binary')
    const decipher = createDecipheriv(this.algorithm, key, iv)
    let decrypted = decipher.update(encryptedObject.data, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return JSON.parse(decrypted)
  }

  decryptString(encryptedObject: EncryptedObject, customSecret?: string): string {
    const iv = Buffer.from(encryptedObject.iv, 'hex')
    const key = Buffer.from(customSecret ?? this.SECRET, 'binary')
    const decipher = createDecipheriv(this.algorithm, key, iv)
    let decrypted = decipher.update(encryptedObject.data, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
  }
}
