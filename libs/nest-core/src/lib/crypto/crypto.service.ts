import { Injectable } from '@nestjs/common'
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto'

@Injectable()
export class CryptoService {
  constructor() {}

  randomString() {
    return randomBytes(16)
  }

  encryptKey(key: string, salt: string) {
    const saltHash = createHash('sha256').update(salt).digest()
    const iv = randomBytes(16) // generate a strong random initialization vector
    const cipher = createCipheriv('aes-256-ctr', Buffer.from(saltHash), iv)

    let encryptedKey = cipher.update(key)
    encryptedKey = Buffer.concat([encryptedKey, cipher.final()])

    return `${iv.toString('hex')}.${encryptedKey.toString('hex')}`
  }

  decryptKey(encryptedKey: string, salt: string) {
    const saltHash = createHash('sha256').update(salt).digest()
    const parts = encryptedKey.split('.')
    const iv = Buffer.from(parts.shift() ?? '', 'hex')
    const encrypted = Buffer.from(parts.join('.'), 'hex')
    const decipher = createDecipheriv('aes-256-ctr', Buffer.from(saltHash), iv)

    let decryptedKey = decipher.update(encrypted)
    decryptedKey = Buffer.concat([decryptedKey, decipher.final()])

    return decryptedKey.toString()
  }
}
