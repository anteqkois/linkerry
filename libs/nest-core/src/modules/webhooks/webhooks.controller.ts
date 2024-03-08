import { Controller } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}
	// TODO implement webhooks handlers
	// /Users/anteqkois/Code/Projects/me/activepieces/packages/server/api/src/app/webhooks/webhook-controller.ts
}
