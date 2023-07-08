import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CONDITION-CONSUMER',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'triggered-condition-consumer-0',
            brokers: ['localhost:29092'],
          },
          consumer: {
            groupId: 'condition',
          },
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class KafkaModule { }
