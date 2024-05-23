import { DynamicModule, Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'

@Module({})
export class KafkaModule {
  static register(options: { clientId: string; brokerUrl: string; groupId: string }): DynamicModule {
    return {
      module: KafkaModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name: 'CONDITION-PRODUCER',
            useFactory: () => ({
              transport: Transport.KAFKA,
              options: {
                client: {
                  clientId: options.clientId,
                  brokers: [options.brokerUrl],
                },
                consumer: {
                  groupId: options.groupId,
                },
              },
            }),
          },
        ]),
      ],
      exports: [ClientsModule],
    }
  }

  static registerAsync(options: {
    inject: any[]
    useFactory: (...args: any[]) => Promise<{
      clientId: string
      brokerUrl: string
      groupId: string
    }>
  }): DynamicModule {
    return {
      module: KafkaModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name: 'CONDITION-PRODUCER',
            inject: options.inject,
            useFactory: async (...args: any[]): Promise<any> => {
              const config = await options.useFactory(...args)
              return {
                transport: Transport.KAFKA,
                options: {
                  client: {
                    clientId: config.clientId,
                    brokers: [config.brokerUrl],
                  },
                  consumer: {
                    groupId: config.groupId,
                  },
                },
              }
            },
          },
        ]),
      ],
      exports: [ClientsModule],
    }
  }
}
