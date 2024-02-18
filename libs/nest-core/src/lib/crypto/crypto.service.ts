import { EncryptedObject, assertNotNullOrUndefined } from '@linkerry/shared'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

@Injectable()
export class CryptoService {
	private readonly ivLength = 16
	private readonly algorithm = 'aes-256-cbc'
	secret: string

	constructor(private readonly configService: ConfigService) {
		assertNotNullOrUndefined(configService.get('ENCRYPTION_KEY'), 'process.env.ENCRYPTION_KEY')
		this.secret = this.configService.getOrThrow<string>('ENCRYPTION_KEY')
	}

	randomString() {
		return randomBytes(16)
	}

	encryptString(inputString: string): EncryptedObject {
		const iv = randomBytes(this.ivLength) // Generate a random initialization vector
		const key = Buffer.from(this.secret, 'binary')
		const cipher = createCipheriv(this.algorithm, key, iv) // Create a cipher with the key and initialization vector
		let encrypted = cipher.update(inputString, 'utf8', 'hex')
		encrypted += cipher.final('hex')
		return {
			iv: iv.toString('hex'),
			data: encrypted,
		}
	}

	encryptObject(object: unknown): EncryptedObject {
		const objectString = JSON.stringify(object) // Convert the object to a JSON string
		return this.encryptString(objectString)
	}

	decryptObject<T>(encryptedObject: EncryptedObject): T {
		const iv = Buffer.from(encryptedObject.iv, 'hex')
		const key = Buffer.from(this.secret, 'binary')
		const decipher = createDecipheriv(this.algorithm, key, iv)
		let decrypted = decipher.update(encryptedObject.data, 'hex', 'utf8')
		decrypted += decipher.final('utf8')
		return JSON.parse(decrypted)
	}

	decryptString(encryptedObject: EncryptedObject): string {
		const iv = Buffer.from(encryptedObject.iv, 'hex')
		const key = Buffer.from(this.secret, 'binary')
		const decipher = createDecipheriv(this.algorithm, key, iv)
		let decrypted = decipher.update(encryptedObject.data, 'hex', 'utf8')
		decrypted += decipher.final('utf8')
		return decrypted
	}
}
