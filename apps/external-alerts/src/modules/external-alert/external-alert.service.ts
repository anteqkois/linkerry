import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientKafka } from '@nestjs/microservices';
import { CreateExternalAlertDto, } from './dto/create-external-alert-trading-view.dto';

@Injectable()
export class ExternalAlertService {
  private topic: string

  constructor(@Inject('CONDITION-PRODUCER') private readonly client: ClientKafka, private configService: ConfigService) {
    this.topic = this.configService.get('KAFKA_CONDITION_TOPIC_NAME')
  }

  async processAlert(createExternalAlertDto: CreateExternalAlertDto) {
    console.log(createExternalAlertDto);
    await this.client.emit(this.topic, JSON.stringify(createExternalAlertDto))

    return { message: 'Event created' };
  }
}
