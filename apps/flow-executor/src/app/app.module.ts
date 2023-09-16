import { Module } from '@nestjs/common'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConnectorsModule } from './modules/connectors/connectors.module'
import { TriggersModule } from './modules/triggers/triggers.module'

@Module({
  imports: [ConnectorsModule, TriggersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
