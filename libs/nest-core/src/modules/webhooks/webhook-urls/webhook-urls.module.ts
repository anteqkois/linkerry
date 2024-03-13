import { Module } from '@nestjs/common';
import { WebhookUrlsService } from './webhook-urls.service';

@Module({
  providers: [WebhookUrlsService],
  exports: [WebhookUrlsService],
})
export class WebhooksUrlsModule {}
