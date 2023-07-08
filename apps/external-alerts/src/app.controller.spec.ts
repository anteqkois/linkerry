import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientKafka } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let configService: ConfigService;
  let client: ClientKafka;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        // {
        //   provide: 'CONDITION-PRODUCER',
        //   useValue: {
        //     emit: jest.fn(),
        //   },
        // },
        {
          provide: 'CONDITION-PRODUCER',
          useFactory: () => new ClientKafka({
            client: {
              clientId: 'external-alerts-0',
              brokers: ['localhost:29092'],
            },
          }),
        }
      ],
      imports: [
        ConfigModule.forRoot({ envFilePath: '.env.test', }),
      ]
    }).compile();

    appController = app.get<AppController>(AppController);
    configService = app.get<ConfigService>(ConfigService);
    client = app.get<ClientKafka>('CONDITION-PRODUCER');
  });

  describe('root', () => {
    it('should return Date', () => {
      expect(appController.healthCheck()).toBe(Date);
    });
  });

  // describe('kafka', () => {
  //   it('should emit a message to Kafka', () => {
  //     const topic = configService.get('KAFKA_CONDITION_TOPIC_NAME');
  //     const emitSpy = jest.spyOn(client, 'emit');

  //     appController.testKafka();

  //     expect(emitSpy).toHaveBeenCalledWith(topic, { foo: 'bar' });
  //   });
  // });
});
