import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { getServerUrl } from '../../lib/helpers/public-ip-utils'
import { GetWebhookUrlParams, WebhookUrlSuffix } from './types'

@Injectable()
export class WebhooksService {
	private readonly logger = new Logger(WebhooksService.name)

	constructor(private readonly configService: ConfigService) {
		//
	}

	async getWebhookPrefix(): Promise<string> {
		return `${await getServerUrl()}v1/webhooks`
	}

	async getWebhookUrl({ flowId, simulate }: GetWebhookUrlParams): Promise<string> {
		const suffix: WebhookUrlSuffix = simulate ? '/simulate' : ''
		const webhookPrefix = await this.getWebhookPrefix()
		this.logger.debug(`#getWebhookUrl`, webhookPrefix)
		return `${webhookPrefix}/${flowId}${suffix}`
	}
}
