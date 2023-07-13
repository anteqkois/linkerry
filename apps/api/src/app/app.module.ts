import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongodbModule } from './common/mongodb';
import { AlertsModule } from './modules/alerts/alerts.module';
import { CondictionsModule } from './modules/condictions/condictions.module';
import { CustomersModule } from '@market-connector/core';

@Module({
  imports: [AlertsModule, MongodbModule, CondictionsModule, CustomersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
