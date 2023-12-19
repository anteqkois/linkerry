import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
import { EventsService } from './events.service';
// import { EventModelFactory } from './schemas/alert.schema';

@Module({
  imports: [
    // MongooseModule.forFeatureAsync([EventModelFactory
    // ])
  ],
  providers:[
    EventsService
  ]
})
export class EventsModule { }
