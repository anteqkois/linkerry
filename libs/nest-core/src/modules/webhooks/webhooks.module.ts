import { Module } from '@nestjs/common';
import { WebhookSecretsService } from './webhook-secrets.service';
import { WebhooksController } from './webhooks.controller';
import { WebhooksService } from './webhooks.service';

@Module({
  controllers: [WebhooksController],
  providers: [WebhooksService, WebhookSecretsService],
  exports: [WebhooksService, WebhookSecretsService]
})
export class WebhooksModule {}
