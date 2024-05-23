import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AppEventRoutingService {
  constructor(private readonly configService: ConfigService) {}

  getAppWebhookUrl({ appName }: { appName: string }): string | undefined {
    const webhookUrl = this.configService.getOrThrow('WEBHOOK_URL')
    if (webhookUrl) {
      return `${webhookUrl}/v1/app-events/${appName}`
    }
    const frontendUrl = this.configService.getOrThrow('FRONTEND_HOST')
    return `${frontendUrl}/api/v1/app-events/${appName}`
  }
}
