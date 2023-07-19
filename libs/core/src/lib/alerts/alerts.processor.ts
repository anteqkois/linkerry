import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Condition, ConditionDocument, ConditionEvent, ConditionOperatorType, ConditionTypeType } from '../conditions';
import { Alert, AlertDocument } from './schemas/alert.schema';
import { TradinViewDto } from './trading-view';
import { ClientKafka } from '@nestjs/microservices';
import { EventsService } from '../events/events.service';
import { EventObjectType } from '../events';

@Injectable()
export class AlertsProcessor {
  private readonly logger = new Logger(AlertsProcessor.name);
  private readonly topic: string

  constructor(
    private readonly configService: ConfigService,
    private readonly eventsService: EventsService,
    @InjectModel(Alert.name) private readonly alertModel: Model<AlertDocument>,
    @InjectModel(Condition.name) private readonly conditionModel: Model<ConditionDocument>,
    @Inject('CONDITION-PRODUCER') private readonly client: ClientKafka
  ) {
    this.topic = this.configService.get<string>('KAFKA_CONDITION_TOPIC_NAME') ?? ''
  }


  async handleTradinViewAlert(dto: TradinViewDto) {
    console.log(dto);
    // const event: ConditionEvent = {
    //   event_id: this.eventsService.generateEventId(),
    //   object: EventObjectType.CONDITION,
    //   data: {
    //     type: ConditionTypeType.ALERT,
    //     value: "1",
    //   }
    // }

    // this.client.emit(this.topic, JSON.stringify(event))
    this.logger.verbose('New event created')
  }
}
