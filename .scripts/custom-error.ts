export enum ErrorCode {
	APP_CONNECTION_NOT_FOUND = 'APP_CONNECTION_NOT_FOUND',
	AUTHENTICATION = 'AUTHENTICATION',
	AUTHORIZATION = 'AUTHORIZATION',
	CONFIG_NOT_FOUND = 'CONFIG_NOT_FOUND',
}

type CustomErrorMetadata = Record<string, any>

export class CustomError extends Error {
	name = 'CustomError'
	isOperational = true
	metadata: CustomErrorMetadata | null
	code: ErrorCode

	constructor(
		message: string,
		code: ErrorCode,
		metadata?: CustomErrorMetadata,
		// isOperational = true
	) {
		super(`${code} ${message}`)
		this.metadata = metadata ?? null
		this.code = code
		Error.captureStackTrace(this, this.constructor)
	}
}

const main = async () => {
	try {
		throw new CustomError('Test error without metadata', ErrorCode.AUTHENTICATION)
	} catch (error) {
		console.log(error)
		console.log(error.name)
	}

	try {
		throw new CustomError('Test error witj metadata', ErrorCode.AUTHENTICATION, {
			test: true,
			action: 'TEST',
		})
	} catch (error) {
		console.log(error)
	}
}

main()
	.then()
	.catch((err) => console.log(err))
