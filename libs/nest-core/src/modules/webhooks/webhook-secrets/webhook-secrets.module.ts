import { Module } from '@nestjs/common';
import { WebhookSecretsService } from './webhook-secrets.service';

@Module({
	providers: [WebhookSecretsService],
	exports: [WebhookSecretsService],
})
export class WebhookSecretsModule {}
