import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConnectorsModule } from './modules/connectors/connectors.module'

@Module({
  imports: [ConnectorsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
