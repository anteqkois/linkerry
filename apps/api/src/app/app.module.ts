import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { MongodbModule } from './common/mongodb';
import { CustomersModule, AlertsModule, CondictionsModule } from '@market-connector/core';

@Module({
  imports: [AlertsModule,  CondictionsModule, CustomersModule, AlertsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
