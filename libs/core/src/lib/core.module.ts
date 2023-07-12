import { Module } from '@nestjs/common';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [
    KafkaModule
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class CoreModule { }
