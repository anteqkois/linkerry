import { Id } from '@linkerry/shared'
import { Injectable, Logger } from '@nestjs/common'
import { getServerUrl } from '../../../lib/helpers/public-ip-utils'

@Injectable()
export class WebhookUrlsService {
	private readonly logger = new Logger(WebhookUrlsService.name)

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

export type WebhookUrlSuffix = '' | '/simulate'

export interface GetWebhookUrlParams {
	flowId: Id
	simulate?: boolean
}

