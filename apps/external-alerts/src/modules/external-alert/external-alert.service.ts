import { Inject, Injectable } from '@nestjs/common';
import { CreateExternalAlertDto,  } from './dto/create-external-alert.dto';
import { UpdateExternalAlertDto } from './dto/update-external-alert.dto';
import { ClientKafka } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ExternalAlertService {
  private topic: string

  constructor(@Inject('CONDITION-PRODUCER') private readonly client: ClientKafka, private configService: ConfigService) {
    this.topic = this.configService.get('KAFKA_CONDITION_TOPIC_NAME')
  }

  async processAlert(createExternalAlertDto: CreateExternalAlertDto) {
    console.log(createExternalAlertDto);
    // await this.client.emit(this.topic, JSON.stringify(createExternalAlertDto))

    return 'Evenet Created';
  }
}
