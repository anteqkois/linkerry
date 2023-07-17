import { Module } from '@nestjs/common';
import { AlertsController } from './alerts.controller';
import { AlertsService } from './alerts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { alertModelFactory } from './schemas/alert.schema';
import { conditionModelFactory } from '../conditions';
import { MessageProvider } from './message.provider';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeatureAsync([alertModelFactory, conditionModelFactory
    ])
  ],
  controllers: [AlertsController],
  providers: [AlertsService, MessageProvider]
})
export class AlertsModule { }
