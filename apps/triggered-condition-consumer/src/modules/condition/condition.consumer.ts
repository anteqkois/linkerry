import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientKafka, EventPattern } from '@nestjs/microservices';
import { CreateConditionDto } from './dto/create-condition.dto';

@Injectable()
export class ConditionConsumer {
  private topic: string

  constructor(@Inject('CONDITION-CONSUMER') private readonly client: ClientKafka, private configService: ConfigService) {
    this.topic = this.configService.get<string>('KAFKA_CONDITION_TOPIC_NAME')
  }

  processTriggered(createConditionDto: CreateConditionDto) {
    
  }
}
