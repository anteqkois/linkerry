import { CustomError, EncryptedObject, ErrorCode, isEmpty } from '@linkerry/shared'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

@Injectable()
export class CryptoService {
  private IV_LENGTH: number
  private ENCRYPTION_ALG: string
  private ENCRYPTION_KEY: string

  constructor(private readonly configService: ConfigService) {
    this.ENCRYPTION_KEY = this.configService.getOrThrow<string>('ENCRYPTION_KEY')
    if (isEmpty(this.ENCRYPTION_KEY)) throw new CustomError(`ENCRYPTION_KEY is empty`, ErrorCode.SYSTEM_ENV_INVALID)

    this.ENCRYPTION_ALG = this.configService.getOrThrow<string>('ENCRYPTION_ALG')
    console.log('this.ENCRYPTION_ALG');
    console.log(this.ENCRYPTION_ALG);
    if (isEmpty(this.ENCRYPTION_ALG)) throw new CustomError(`ENCRYPTION_ALG is empty`, ErrorCode.SYSTEM_ENV_INVALID)

    this.IV_LENGTH = +this.configService.getOrThrow<string>('IV_LENGTH')
    if (isEmpty(this.IV_LENGTH)) throw new CustomError(`IV_LENGTH is empty`, ErrorCode.SYSTEM_ENV_INVALID)
  }

  encryptString(inputString: string, customSecret?: string): EncryptedObject {
    const iv = randomBytes(this.IV_LENGTH) // Generate a random initialization vector
    const key = Buffer.from(customSecret ?? this.ENCRYPTION_KEY, 'binary')
    const cipher = createCipheriv(this.ENCRYPTION_ALG, key, iv) // Create a cipher with the key and initialization vector
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
    const key = Buffer.from(customSecret ?? this.ENCRYPTION_KEY, 'binary')
    const decipher = createDecipheriv(this.ENCRYPTION_ALG, key, iv)
    let decrypted = decipher.update(encryptedObject.data, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return JSON.parse(decrypted)
  }

  decryptString(encryptedObject: EncryptedObject, customSecret?: string): string {
    const iv = Buffer.from(encryptedObject.iv, 'hex')
    const key = Buffer.from(customSecret ?? this.ENCRYPTION_KEY, 'binary')
    const decipher = createDecipheriv(this.ENCRYPTION_ALG, key, iv)
    let decrypted = decipher.update(encryptedObject.data, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
  }
}
