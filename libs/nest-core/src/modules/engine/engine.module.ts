import { Module } from '@nestjs/common'
import { AppEventRoutingModule } from '../app-event-routing/app-event-routing.module'
import { ConnectorsMetadataModule } from '../flows/connectors/connectors-metadata/connectors-metadata.module'
import { AuthModule } from '../users/auth'
import { WebhookSecretsModule } from '../webhooks/webhook-secrets/webhook-secrets.module'
import { SandboxModule } from '../workers/sandbox/sandbox.module'
import { EngineService } from './engine.service'

@Module({
  imports: [SandboxModule, AuthModule, AppEventRoutingModule, WebhookSecretsModule, ConnectorsMetadataModule],
  providers: [EngineService],
  exports: [EngineService],
})
export class EngineModule {}
