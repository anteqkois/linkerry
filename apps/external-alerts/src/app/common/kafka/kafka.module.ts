import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({})
export class KafkaModule {
  static register(options: {
    clientId: string
  }): DynamicModule {
    return {
      module: KafkaModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name: 'CONDITION-PRODUCER',
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
              transport: Transport.KAFKA,
              options: {
                client: {
                  clientId: options.clientId,
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
      ],
      exports: [ClientsModule],
    };
  }
}

// @Module({
//   imports: [
//     ClientsModule.registerAsync([
//       {
//         name: 'CONDITION-PRODUCER',
//         imports: [ConfigModule],
//         useFactory: async (configService: ConfigService) => ({
//           transport: Transport.KAFKA,
//           options: {
//             client: {
//               clientId: 'external-alerts-0',
//               brokers: [configService.get<string>('KAFKA_CONDITION_BROKER_URL')],
//             },
//             consumer: {
//               groupId: configService.get<string>('KAFKA_CONDITION_GROUP_ID'),
//             },
//           },
//         }),
//         inject: [ConfigService],
//       },
//     ])
//   ],
//   exports: [ClientsModule],
// })
// export class KafkaModule { }
