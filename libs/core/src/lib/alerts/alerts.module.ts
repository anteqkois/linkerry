import { Module } from '@nestjs/common';
import { AlertsController } from './alerts.controller';
import { AlertsService } from './alerts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { alertModelFactory } from './schemas/alert.schema';
import { conditionModelFactory } from '../conditions';

@Module({
  imports:[
    MongooseModule.forFeatureAsync([alertModelFactory, conditionModelFactory
    ])
  ],
  controllers: [AlertsController],
  providers: [AlertsService]
})
export class AlertsModule { }
