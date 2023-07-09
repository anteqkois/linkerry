import { ConditionOperatorType, ConditionTypeType, CreateConditionEventDto, EventObjectType, } from '@market-connector/core';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientKafka } from '@nestjs/microservices';
import { CreateExternalAlertTradinViewDto, } from './dto/create-external-alert-trading-view.dto';
import crypto from 'crypto'

@Injectable()
export class ExternalAlertService {
  private topic: string

  constructor(@Inject('CONDITION-PRODUCER') private readonly client: ClientKafka, private configService: ConfigService) {
    this.topic = this.configService.get('KAFKA_CONDITION_TOPIC_NAME')
  }

  async processAlert(createExternalAlertDto: CreateExternalAlertTradinViewDto) {
    const event: CreateConditionEventDto = {
      event_id: `${ createExternalAlertDto.ticker }_${ crypto.randomUUID({ disableEntropyCache: false }) }`,
      object: EventObjectType.CONDITION,
      data: {
        type: ConditionTypeType.ALERT,
        ticker: createExternalAlertDto.ticker,
        operator: ConditionOperatorType.CROSSING_UP,
        value: createExternalAlertDto.price
      }
    }

    this.client.emit(this.topic, JSON.stringify(event))

    return { message: 'Event created', data: event };
  }
}
