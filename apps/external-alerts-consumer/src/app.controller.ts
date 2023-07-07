import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientKafka } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';

@Controller()
export class AppController {
  private topic: string

  constructor(
    private readonly appService: AppService,
    private configService: ConfigService,
    @Inject('CONDITION-PRODUCER') private readonly client: ClientKafka,
  ) {

    this.topic = this.configService.get('KAFKA_CONDITION_TOPIC_NAME')
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('kafka-test')
  testKafka(): Observable<any> {
    return this.client.emit(this.topic, { foo: 'bar' })
  }
}
