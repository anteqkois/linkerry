import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientKafka } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  healthCheck(): Date {
    return this.appService.getDate();
  }

  // @Get('kafka-test')
  // testKafka(): Observable<any> {
  //   return this.client.emit(this.topic, { foo: 'bar' })
  // }
}
