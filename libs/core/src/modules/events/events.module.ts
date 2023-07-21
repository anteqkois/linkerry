import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongodbModule } from '../../lib/mongodb';
import { EventsService } from './events.service';
import { EventModelFactory } from './schemas/alert.schema';

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
