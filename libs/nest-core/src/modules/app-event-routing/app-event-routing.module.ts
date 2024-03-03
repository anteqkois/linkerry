import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppEventRoutingController } from './app-event-routing.controller'
import { AppEventRoutingService } from './app-event-routing.service'

@Module({
	imports: [ConfigModule],
	controllers: [AppEventRoutingController],
	providers: [AppEventRoutingService],
	exports: [AppEventRoutingService],
})
export class AppEventRoutingModule {}
