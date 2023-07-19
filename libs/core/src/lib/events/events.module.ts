import { Module } from '@nestjs/common';
import { MongodbModule } from '../mongodb';
import { MongooseModule } from '@nestjs/mongoose';
import { EventModelFactory } from './schemas/alert.schema';
import { EventsService } from './events.service';

@Module({
  imports: [
    MongodbModule,
    MongooseModule.forFeatureAsync([EventModelFactory
    ])
  ],
  providers:[
    EventsService
  ]
})
export class EventsModule { }
