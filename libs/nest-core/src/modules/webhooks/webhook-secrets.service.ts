import { isNil } from '@linkerry/shared'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class WebhookSecretsService {
	private WEBHOOK_SECRETS: Record<string, { webhookSecret: string }>
	private readonly logger = new Logger(WebhookSecretsService.name)

	constructor(private readonly configService: ConfigService) {
		const webhookSecretsString = configService.getOrThrow('APP_WEBHOOK_SECRETS')
		this.WEBHOOK_SECRETS = JSON.parse(webhookSecretsString)
	}

	getWebhookSecret(connectorName?: string) {
		if (!connectorName) {
			return undefined
		}

		const appConfig = this.WEBHOOK_SECRETS[connectorName]
		if (isNil(appConfig)) return undefined

		return appConfig.webhookSecret
	}
}
