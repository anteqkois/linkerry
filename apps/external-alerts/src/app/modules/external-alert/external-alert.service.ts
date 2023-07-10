import { ConditionTypeType, CreateConditionEventDto, EventObjectType } from '@market-connector/core';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientKafka } from '@nestjs/microservices';
import crypto from 'crypto';
import { CreateExternalAlertTradinViewDto, } from './dto/create-external-alert.dto';

@Injectable()
export class ExternalAlertService {
  private topic: string

  constructor(@Inject('CONDITION-PRODUCER') private readonly client: ClientKafka, private configService: ConfigService) {
    this.topic = this.configService.get('KAFKA_CONDITION_TOPIC_NAME')
  }

  async processAlert(creatAlertDto: CreateExternalAlertTradinViewDto) {
    const event: CreateConditionEventDto = {
      event_id: `${creatAlertDto.alertId}_${ crypto.randomUUID({ disableEntropyCache: false }) }`,
      object: EventObjectType.CONDITION,
      data: {
        type: ConditionTypeType.ALERT,
        value: "1"
      }
    }

    this.client.emit(this.topic, JSON.stringify(event))
    return { message: 'Event created', data: event };
  }
}
