import { ConditionOperatorType, ConditionTypeType, CreateConditionEventDto, EventObjectType, } from '@market-connector/core';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientKafka } from '@nestjs/microservices';
import crypto from 'crypto';
import { CreateAlertTradinViewDto, } from './dto/create-alert-trading-view.dto';

@Injectable()
export class AlertService {
  private topic: string

  constructor(@Inject('CONDITION-PRODUCER') private readonly client: ClientKafka, private configService: ConfigService) {
    this.topic = this.configService.get('KAFKA_CONDITION_TOPIC_NAME')
  }

  async processAlert(creatAlertDto: CreateAlertTradinViewDto) {
    const event: CreateConditionEventDto = {
      event_id: `${ creatAlertDto.ticker }_${ crypto.randomUUID({ disableEntropyCache: false }) }`,
      object: EventObjectType.CONDITION,
      data: {
        type: ConditionTypeType.ALERT,
        ticker: creatAlertDto.ticker,
        operator: ConditionOperatorType.CROSSING_UP,
        value: creatAlertDto.price
      }
    }

    this.client.emit(this.topic, JSON.stringify(event))

    return { message: 'Event created', data: event };
  }
}
