import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'CONDITION-PRODUCER',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'external-alerts-0',
              brokers: [configService.get<string>('KAFKA_CONDITION_BROKER_URL')],
            },
            consumer: {
              groupId: configService.get<string>('KAFKA_CONDITION_GROUP_ID'),
            },
          },
        }),
        inject: [ConfigService],
      },
    ])
    // ClientsModule.register([
    //   {
    //     name: 'CONDITION-PRODUCER',
    //     transport: Transport.KAFKA,
    //     options: {
    //       client: {
    //         clientId: 'external-alerts-0',
    //         brokers: ['localhost:29092'],
    //       },
    //       consumer: {
    //         groupId: 'condition',
    //       },
    //     },
    //   },
    // ]),
  ],
  exports: [ClientsModule],
})
export class KafkaModule { }
